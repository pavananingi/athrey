"use strict";
const fromEntity = require("../../entity");
const fromNotificationService = require("../../services").Services;

module.exports = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  request,
  db,
  ac,
  notifications,
  mailer,
}) => {
  return Object.freeze({
    execute: async () => {
      try {
        const lang = request.lang;
        const userUID = request.locals.uid;
        const role = request.locals.role;
        const urlParams = request.urlParams;

        if (userUID === undefined) {
          throw new CreateError(translate(lang, "invalid_details"));
        }

        let permission = ac.can(role).createOwn("consultation");

        if (urlParams.userUID) {
          if (urlParams.userUID !== userUID) {
            permission = ac.can(role).createAny("consultation");
          }
        }

        if (role === "admin" || role === "superadmin") {
          permission = ac.can(role).createAny("consultation");
        }

        if (!permission.granted) {
          throw new CreateError(translate(lang, "forbidden"), 403);
        }

        // filter body based on the role
        const body = permission.filter(request.body);

        const entity = (
          await fromEntity.entities.Consultation.CreateConsultation({
            CreateError,
            DataValidator,
            logger,
            translate,
            lang,
            params: {
              ...body,
              patient_uid: userUID,
            },
          }).generate()
        ).data.entity;

        const consultationsTable = db.methods.Consultations({
          translate,
          logger,
          CreateError,
          lang,
        });

        // register consultations
        const consultations = (await consultationsTable.create({ ...entity }))
          .data.consultations;

        // fromNotificationService
        //   .ConsultationNotification({
        //     translate,
        //     logger,
        //     CreateError,
        //     lang,
        //     notifications,
        //     db,
        //   })
        //   .new({ consultationUID: consultations.uid });

        // send mail
        db.methods
          .User({ CreateError, logger, lang, translate })
          .findByUID({ uid: userUID, includeAll: false })
          .then((result) => {
            const user = result.data.users;
            if (user) {
              mailer.methods
                .Send({ CreateError, translate, logger, lang })
                .consultationCreatedToPatient({
                  to: user.email,
                  salute: user.salute,
                  title: user.title,
                  firstname: user.firstname,
                  lastname: user.lastname,
                  preferredSchedule: consultations.preferred_schedule,
                });
            }
          });

        return {
          msg: translate(lang, "created_consultation"),
          data: { consultations: consultations },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(`Failed to create consultation: %s`, error);
        throw new Error(error.message);
      }
    },
  });
};
