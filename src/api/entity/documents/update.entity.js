module.exports = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    lang,
    params = {
        name,
        tags
    }
}) => {
    return Object.freeze({
        generate: async () => {
            try {
                const validate = DataValidator({ CreateError, lang, translate });

                let entity = {
                    name: null,
                    // tags: []
                };

                if (params.name) {
                    entity.name = validate.toString(params.name).data.value;
                } else {
                    delete entity.name;
                }

                return {
                    msg: translate(lang, 'success'),
                    data: { entity }
                }
            } catch (error) {
                logger.error('Failed to update documents entity: %s', error);
                if (error instanceof CreateError) {
                    throw error;
                }
                throw new Error(translate(lang, 'error_unknown'))
            }
        }
    })
}