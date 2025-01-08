module.exports = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    lang,
    params = {
        rating,
        review,
    }
}) => {
    return Object.freeze({
        async generate() {
            try {
                const validate = DataValidator({ CreateError, lang, translate });

                let entity = {
                    rating: null,
                    review: null,
                }

                if (params.rating) {
                    entity.rating = validate.toString(params.rating).data.value;
                } else {
                    delete entity.rating;
                }

                if (params.review) {
                    entity.review = validate.toString(params.review).data.value;
                } else {
                    delete entity.review;
                }

                return {
                    msg: 'success',
                    data: { entity }
                }

            } catch (error) {
                logger.error('Failed to update call log entity: %s', error);
                if (error instanceof CreateError) {
                    throw error;
                }
                throw new Error(translate(lang, 'error_unknown'))
            }
        }
    })
}
