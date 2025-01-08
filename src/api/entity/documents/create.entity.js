module.exports = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    lang,
    params = {
        user_uid,
        documents
    }
}) => {
    return Object.freeze({
        generate: async () => {
            try {
                const validate = DataValidator({ CreateError, lang, translate });

                let entity = {
                    user_uid: null,
                    documents: []
                };

                if (params.user_uid) {
                    entity.user_uid = validate.uuid(params.user_uid).data.value;
                } else {
                    delete entity.user_uid;
                }

                if (params.documents) {
                    const validatedDocuments = validate.documents(params.documents).data.value;
                    for (let i = 0; i < validatedDocuments.length; i++) {
                        await validate.validateDocument(validatedDocuments[i])
                            .then(r => entity.documents.push({
                                url: r.url,
                                name: r.name,
                                user_uid: params.user_uid
                            }))
                            .catch(error => {
                                throw new CreateError()
                            })
                    }
                } else {
                    throw new CreateError(translate(lang, 'required_documents'))
                }

                return {
                    msg: translate(lang, 'success'),
                    data: { entity }
                }
            } catch (error) {
                logger.error('Failed to create documents entity: %s', error);
                if (error instanceof CreateError) {
                    throw error;
                }
                throw new Error(translate(lang, 'error_unknown'))
            }
        }
    })
}