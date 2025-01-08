exports.GeneratePassword = ({
  CreateError,
  logger,
  translate,
  request,
  token,
  crypto,
  DataValidator,
  db,
}) => {

  return Object.freeze({
    execute: async () => {
      try {
        const lang = request.lang;
        const { token } = request.urlParams;
        let { password } = request.body;

        const validate = DataValidator({ CreateError, lang, translate });
        if (password) {
          password = crypto.b64.decode(password).data.value;
          console.log("password...", password)
          password = validate.password(password).data.value;
        } else {
          throw new CreateError(translate(lang, 'required_password'))
        }

        const data = crypto.b64.decode(token).data.value;

        let email = data.split("  ")[0];
        let expire_date = new Date(parseInt(data.split("  ")[1]));

        if (expire_date < new Date()) {
          throw new CreateError("Token expired")
        }

        // encrypt password
        const hashedPassword = (await crypto.PasswordHash({
          CreateError, translate, logger,
          password: password
        }).hashPassword()).data.hashedPassword;

        const usersTable = db.methods.User({
          translate,
          logger,
          CreateError,
          lang,
        });

        await usersTable.updateByEmail({
          email: email,
          params: { password: hashedPassword },
        });

        return {
          msg: 'Password genrated successfully.',
          data: {
          }
        }
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Failed to generate password', error);
        throw new Error(error.message);
      }
    }
  })
}