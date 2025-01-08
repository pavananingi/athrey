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
        questions
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
                } else {
                    entity.description = null;
                }

                if (params.illustration_url) {
                    entity.illustration_url = validate.url(params.illustration_url).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_illustration_url'))
                }

                if (params.specialization) {
                    entity.specialization = await validate.validateTranslation(params.specialization)
                        .catch(error => { throw new CreateError(error) });
                } else {
                    throw new CreateError(translate(lang, 'required_specialization_name'))
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
                    entity.questions = [];
                }

                return {
                    msg: 'success',
                    data: { entity }
                }

            } catch (error) {
                logger.error('Failed to create specialization entity: %s', error);
                if (error instanceof CreateError) {
                    throw error;
                }
                throw new Error(translate(lang, 'error_unknown'))
            }
        }
    })
}
