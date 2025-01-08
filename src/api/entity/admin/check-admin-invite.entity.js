exports.CheckAdminInviteEntity = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  lang,
  params = {
    userID,
  }
}) => {
  return Object.freeze({
    generate: () => {
      try {
        const validate = DataValidator({ CreateError, lang, translate });

        let entity = {
          userID: null,
        }

        if(params.userID){
          entity.userID = validate.uuid(params.userID).data.value;
        } else {
          throw new CreateError(translate(lang, 'required_uid'));
        }

        return {
          msg: translate(lang, 'success'),
          data: { entity }
        }
      } catch(error) {
        logger.error('Failed to create admin entity: %s', error);
        if (error instanceof CreateError) {
            throw error;
        }
        throw new Error(translate(lang, 'error_unknown'))
      }
    }
  });
}