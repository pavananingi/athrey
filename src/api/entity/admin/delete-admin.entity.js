exports.DeleteAdminEntity = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  lang,
  params = {
    userUID,
  }
}) => {
  return Object.freeze({
    generate: () => {
      try {
        const validate = DataValidator({ CreateError, lang, translate });

        let entity = {
          userUID: null,
        }

        if(params.userUID){
          entity.userUID = validate.uuid(params.userUID).data.value;
        } else {
          throw new CreateError(translate(lang, 'required_uid'));
        }

        return {
          msg: translate(lang, 'success'),
          data: { entity }
        }
      } catch (error) {
        logger.error('Failed to create admin entity: %s', error);
        if (error instanceof CreateError) {
            throw error;
        }
        throw new Error(translate('en', 'error_unknown'))
      }
    },
  });
}