
module.exports = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    lang,
    params = {
        category
    }
}) => {
    return Object.freeze({
        async generate() {
            try {
                const validate = DataValidator({ CreateError, lang, translate });

                let entity = {
                    category: null
                }

                if (params.category) {
                    entity.category = await validate.validateTranslation(params.category)
                        .catch(error => {
                            throw new CreateError(error)
                        })
                } else {
                    throw new CreateError(translate(lang, 'required_category'));
                }

                return {
                    msg: 'success',
                    data: { entity }
                }

            } catch (error) {
                logger.error('Failed to update category entity: %s', error);
                if (error instanceof CreateError) {
                    throw error;
                }
                throw new Error(translate(lang, 'error_unknown'))
            }
        }
    })
}
