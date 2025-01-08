module.exports = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    lang,
    params = {
        categories
    }
}) => {
    return Object.freeze({
        async generate() {
            try {
                const validate = DataValidator({ CreateError, lang, translate });

                let entity = {
                    categories: []
                }

                if (params.categories) {
                    const validatedCategories = validate.categories(params.categories).data.value;
                    for (let i = 0; i < validatedCategories.length; i++) {
                        await validate.validateTranslation(validatedCategories[i])
                            .then(r => entity.categories.push(r))
                            .catch(error => {
                                throw new CreateError(error)
                            })
                    }
                } else {
                    throw new CreateError(translate(lang, 'required_category'))
                }

                return {
                    msg: 'success',
                    data: { entity }
                }

            } catch (error) {
                logger.error('Failed to create categories entity: %s', error);
                if (error instanceof CreateError) {
                    throw error;
                }
                throw new Error(translate(lang, 'error_unknown'))
            }
        }
    })
}
