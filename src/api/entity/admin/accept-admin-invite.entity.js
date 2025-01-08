exports.AcceptAdminInviteEntity = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  lang,
  crypto,
  params = {
    userUID,
    password,
    verify_password
  }
}) => {
  return Object.freeze({
    generate: () => {
      try{
        const validate = DataValidator({ CreateError, lang, translate });

        let entity = {
          userUID: null,
          password: null,
          verify_password: null,
        }

        if(params.userUID){
          entity.userUID = validate.uuid(params.userUID).data.value;
        } else {
          throw new CreateError(translate(lang, 'required_uid'));
        }

        if (params.password) {
          const password = crypto.b64.decode(params.password).data.value;
          entity.password = validate.password(password).data.value;
        } else {
            throw new CreateError(translate(lang, 'required_password'))
        }

        if (params.verify_password) {
            const verifyPassword = crypto.b64.decode(params.verify_password).data.value;
            if (verifyPassword === entity.password) {
                entity.verify_password = entity.password;
            } else {
                throw new CreateError(translate(lang, 'password_mismatch'))
            }
        } else {
            throw new CreateError(translate(lang, 'required_verify_password'))
        }

        return {
          msg: translate(lang, 'success'),
          data: { entity }
        }
      } catch (error) {
        logger.error("Fail to create accept admin invite entity: %s", error);
        if(error instanceof CreateError) {
          throw error;
        }
        throw new Error(translate(lang, 'error_unknown'));
      }
    },
  });
}