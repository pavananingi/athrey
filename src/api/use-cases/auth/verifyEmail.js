exports.VerifyEmail = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  crypto,
  request,
  db,
  mailer,
  emailLinkExpirationDuration,
}) => {
  return Object.freeze({
    execute: async () => {
      try {
        const lang = request.locals.lang;
        const usersTable = db.methods.User({
          translate,
          logger,
          CreateError,
          lang,
        });

        const date = crypto.b64.decode(`${request.urlParams.date}`).data.value;

        if (
          new Date(parseInt(date)).getTime() +
            emailLinkExpirationDuration * 1000 <
          Date.now()
        )
          throw new CreateError(translate(lang, "link_expired"));
        const uid = request.urlParams.uid;
        // check for the email available or not
        const findUser = (
          await usersTable.findByUID({
            uid: uid,
            includeAll: false,
          })
        ).data.users;

        if (findUser === null) {
          // throw new CreateError(translate(lang, 'email_exists'))
          throw new CreateError(translate(lang, "invalid_details"));
        }

        // encrypt password
        // create user
        const updateUser = (
          await usersTable.updateByUID({
            uid,
            params: { email_verified: true },
          })
        ).data;
        console.log(updateUser);

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
          msg: translate(lang, "success_email_verified"),
          data: {},
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
