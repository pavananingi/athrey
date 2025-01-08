module.exports = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    lang,
    params = {
        description,
        illustration_url,
        specialization,
        questions,
    }
}) => {
    return Object.freeze({
        async generate() {
            try {
                const validate = DataValidator({ CreateError, lang, translate });

                let entity = {
                    description: null,
                    illustration_url: null,
                    specialization: null,
                    questions: [],
                }

                if (params.description) {
                    entity.description = await validate.validateTranslation(params.description)
                        .catch(error => { throw new CreateError(error) });
                } else if (params.description === '' || params.description === null) {
                    entity.description = null;
                } else {
                    delete entity.description;
                }

                if (params.illustration_url) {
                    entity.illustration_url = validate.url(params.illustration_url).data.value;
                } else {
                    delete entity.illustration_url;
                }

                if (params.specialization) {
                    entity.specialization = await validate.validateTranslation(params.specialization)
                        .catch(error => { throw new CreateError(error) });
                } else {
                    delete entity.specialization;
                }

                if (params.questions) {
                    for (let i = 0; i < params.questions.length; i++) {
                        await validate.question(params.questions[i])
                            .then(r => {
                                entity.questions.push(r)
                            })
                            .catch(error => {
                                throw new CreateError(error)
                            })
                    }
                } else {
                    delete entity.questions;
                }

                return {
                    msg: 'success',
                    data: { entity }
                }

            } catch (error) {
                logger.error('Failed to construct update specialization entity: %s', error);
                if (error instanceof CreateError) {
                    throw error;
                }
                throw new Error(translate(lang, 'error_unknown'))
            }
        }
    })
}
