"use strict";
// const fromEntity = require("../../../entity");
// const fromNotificationService = require("../../../services").Services;

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
        const patientUid = request.body.patientuid;
        const doctorUid = request.body.doctoruid;
        const consultationUid = request.body.consultationuid;
        // const role = request.locals.role;
        // const urlParams = request.urlParams;
        // const consultationUID = request.urlParams.uid;

        if (patientUid === undefined || doctorUid === undefined) {
          throw new CreateError(translate(lang, "invalid_details"));
        }

        if (!consultationUid) {
          throw new CreateError(translate(lang, "invalid_consultation_uid"));
        }

        // let permission = ac.can(role).createOwn("consultationDoctor");

        // if (urlParams.userUID) {
        //   if (urlParams.userUID !== userUID) {
        //     permission = ac.can(role).createAny("consultationDoctor");
        //   }
        // }

        // if (role === "admin" || role === "superadmin") {
        //   permission = ac.can(role).createAny("consultationDoctor");
        // }

        // if (!permission.granted) {
        //   throw new CreateError(translate(lang, "forbidden"), 403);
        // }

        // let doctorUID = userUID;

        // const doctorDetails = (
        //   await db.methods
        //     .User({ translate, logger, CreateError, lang })
        //     .findByUID({ uid: doctorUID, includeAll: false })
        // ).data.users;

        // if (!doctorDetails.roles.doctor) {
        //   throw new CreateError(translate(lang, "not_doctor"));
        // }

        // // filter body based on the role
        // const body = permission.filter(request.body);

        // const entity = (
        //   await fromEntity.entities.Consultation.Doctor.AssignConsultation({
        //     CreateError,
        //     DataValidator,
        //     logger,
        //     translate,
        //     lang,
        //     params: {
        //       ...body,
        //       doctor_uid: doctorUID,
        //       consultation_uid: consultationUID,
        //     },
        //   }).generate()
        // ).data.entity;

        // const consultationsTable = db.methods.Consultations({
        //   translate,
        //   logger,
        //   CreateError,
        //   lang,
        // });

        // // check whether status is open
        // const consultationDetails = (
        //   await consultationsTable.findByUID({
        //     consultationUID: consultationUID,
        //   })
        // ).data.consultations;
        // if (!consultationDetails) {
        //   throw new CreateError(translate(lang, "consultation_not_found"), 404);
        // }
        // if (consultationDetails.status !== "open") {
        //   throw new CreateError(
        //     translate(lang, "error_consultations_not_open"),
        //     400
        //   );
        // }

        // const consultationDoctorsTable = db.methods.ConsultationDoctors({
        //   translate,
        //   logger,
        //   CreateError,
        //   lang,
        // });

        // // assign consultation doctor
        // const assignDoctor = (
        //   await consultationDoctorsTable.create({ ...entity })
        // ).data.doctors;

        // // change consultation status to scheduled
        // const updateStatus = await consultationsTable.updateStatusByUID({
        //   consultationUID,
        //   status: "scheduled",
        // });

        // fromNotificationService
        //   .ConsultationNotification({
        //     translate,
        //     logger,
        //     CreateError,
        //     lang,
        //     notifications,
        //     db,
        //   })
        //   .scheduled({
        //     consultationUID: assignDoctor.consultation_uid,
        //   });

        // send email
        // db.methods
        //   .TempUser({ CreateError, logger, lang, translate })
        //   .findByUID({ uid: consultationDetails.temp_patient_uid })
        //   .then((result) => {
        //     const user = result.data.TempUser;
        //     if (user) {
        //       mailer.methods
        //         .Send({ CreateError, translate, logger, lang })
        //         .consultationScheduledToTempPatient({
        //           to: user.email,
        //           firstname: user.firstname,
        //           lastname: user.lastname,
        //           confirmedSchedule: entity.confirmed_schedule,
        //           schedule_link: `/u/${user.uid}`,
        //         });
        //     }
        //   });

        return {
          msg: translate(lang, "assign_consultation_doctor"),
          data: {
            patientlink: `athrey-bdev.edalytics.com/p/${consultationUid}/${patientUid}`,
            doctorlink: `athrey-bdev.edalytics.com/d/${consultationUid}/${doctorUid}`,
          },
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
