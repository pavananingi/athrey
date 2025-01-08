const fromEntities = require("../../entity");

exports.createTempUser = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  crypto,
  request,
  db,
  mailer,
}) => {
  return Object.freeze({
    execute: async () => {
      try {
        const lang = request.locals.lang;

        let entity = fromEntities.entities.TempUser.CreateTempUser({
          CreateError,
          DataValidator,
          logger,
          translate,
          crypto,
          lang,
          params: { ...request.body },
        }).generate().data.entity;

        const tempUsersTable = db.methods.TempUser({
          translate,
          logger,
          CreateError,
          lang,
        });

        // check for the email available or not
        const findUser = (
          await tempUsersTable.findByEmail({
            email: entity.email,
            includeAll: false,
          })
        ).data.TempUser;

        if (findUser !== null) {
          // throw new CreateError(translate(lang, 'email_exists'))

          await tempUsersTable.deleteByEmail({
            email: entity.email,
          });
        }

        // create user
        const createUser = (await tempUsersTable.create({ ...entity })).data
          .TempUser;

        // create a role for the user

        // create stripe customer id and update

        // send mail mail
        // mailer.methods.Send({ CreateError, translate, logger, lang })
        //     .signup({
        //         to: createUser.email,
        //         salute: createUser.salute,
        //         title: createUser.title,
        //         firstname: createUser.firstname,
        //         lastname: createUser.lastname,
        //         isPatient: entity.role === 'patient' ? true : false,
        //         isDoctor: entity.role === 'doctor' ? true : false,
        //     })

        return {
          msg: translate(lang, "success_signup"),
          data: { createUser },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(`Failed to signup: %s`, error);
        throw new Error(error.message);
      }
    },
  });
};
