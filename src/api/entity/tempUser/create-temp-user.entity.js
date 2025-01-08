exports.CreateTempUserEntity = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  crypto,
  lang,
  params = {
    firstname,
    lastname,
    email,
  },
}) => {
  return Object.freeze({
    generate: () => {
      try {
        const validate = DataValidator({ CreateError, lang, translate });

        let entity = {
          firstname: null,
          lastname: null,
          email: null,
          consent: true,
        };

        if (params.firstname) {
          entity.firstname = validate.firstname(params.firstname).data.value;
        } else {
          throw new CreateError(translate(lang, "required_firstname"));
        }

        if (params.lastname) {
          entity.lastname = validate.lastname(params.lastname).data.value;
        } else {
          throw new CreateError(translate(lang, "required_lastname"));
        }

        if (params.email) {
          entity.email = validate.email(params.email).data.value;
        } else {
          throw new CreateError(translate(lang, "required_email"));
        }

        if (!params.consent) {
          throw new CreateError(translate(lang, "required_consent"));
        }

        return {
          msg: translate(lang, "success"),
          data: { entity },
        };
      } catch (error) {
        logger.error("Failed to create temporary user entity: %s", error);
        if (error instanceof CreateError) {
          throw error;
        }
        throw new Error(translate(lang, "error_unknown"));
      }
    },
  });
};
