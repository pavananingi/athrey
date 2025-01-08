exports.LoginEntity = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  crypto,
  lang,
  excuteBruteForce,
  params = {
    email,
    password,
  },
}) => {
  return Object.freeze({
    generate: async () => {
      try {
        const validate = DataValidator({
          CreateError,
          lang,
          translate,
          excuteBruteForce,
        });

        let entity = {
          email: null,
          password: null,
        };

        let x = String(crypto.b64.decode(params.password).data.value).trim();
        if (
          !(
            x.match(/[a-z]/g) &&
            x.match(/[A-Z]/g) &&
            x.match(/[0-9]/g) &&
            x.match(/[^a-zA-Z\d]/g) &&
            x.length >= 8 &&
            x.length <= 30
          )
        ) {
          await excuteBruteForce();
          throw new CreateError(
            translate(lang, "invalid_password_criteria"),
            422
          );
        }

        if (params.email) {
          entity.email = validate.email(params.email).data.value;
        } else {
          await excuteBruteForce();
          throw new CreateError(translate(lang, "required_email"));
        }

        if (params.password) {
          const password = crypto.b64.decode(params.password).data.value;
          entity.password = validate.password(password).data.value;
        } else {
          await excuteBruteForce();
          throw new CreateError(translate(lang, "required_password"));
        }

        return {
          msg: translate(lang, "success"),
          data: { entity },
        };
      } catch (error) {
        logger.error("Failed to create login entity: %s", error);
        if (error instanceof CreateError) {
          throw error;
        }
        throw new Error(translate(lang, "error_unknown"));
      }
    },
  });
};
