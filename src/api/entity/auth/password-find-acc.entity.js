exports.PasswordResetEmailEntity = ({
  CreateError,
  DataValidator,
  logger,
  lang,
  translate,
  excuteBruteForce,
  params = { email },
}) => {
  return Object.freeze({
    async generate() {
      try {
        const validate = DataValidator({ CreateError, lang, translate });
        let entity = {
          email: null,
        };
        let x = String(params.email).toLowerCase().trim();
        if (!/^([+.-\w]+)([@])([\w+.-]+\w)([.])(\w+)$/.test(x)) {
          console.log("error");
          await excuteBruteForce();
          throw new CreateError(translate(lang, "invalid_email"), 422);
        }

        if (params.email) {
          entity.email = validate.email(params.email).data.value;
        } else {
          await excuteBruteForce();
          throw new CreateError(translate(lang, "required_email"));
        }

        return {
          msg: translate(lang, "success"),
          data: {
            entity,
          },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error("Failed to construct find account entity", error);
        throw new Error(translate(lang, "error_unknown"));
      }
    },
  });
};
