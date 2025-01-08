module.exports = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    lang,
    params = {
        description,
        illustration_url,
        treatment,
        questions,
        category_uid
    }
}) => {
    return Object.freeze({
        async generate() {
            try {
                const validate = DataValidator({ CreateError, lang, translate });

                let entity = {
                    description: null,
                    illustration_url: null,
                    treatment: null,
                    questions: [],
                    category_uid: null
                }

                if (params.category_uid) {
                    entity.category_uid = validate.uuid(params.category_uid).data.value;
                } else {
                    delete entity.category_uid;
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

                if (params.treatment) {
                    entity.treatment = await validate.validateTranslation(params.treatment)
                        .catch(error => { throw new CreateError(error) });
                } else {
                    delete entity.treatment;
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
                logger.error('Failed to construct update treatment entity: %s', error);
                if (error instanceof CreateError) {
                    throw error;
                }
                throw new Error(translate(lang, 'error_unknown'))
            }
        }
    })
}
