exports.GenBearerToken = ({
    CreateError,
    logger,
    translate,
    request,
    token,
}) => {

    return Object.freeze({
        execute: async () => {
            try {
                const lang = request.locals.lang;

                const authToken = await token.jwt({ CreateError, translate, lang, logger })
                    .generateBearerToken({
                        uid: request.locals.uid,
                        email: request.locals.email,
                        firstname: request.locals.firstname,
                        lastname: request.locals.lastname,
                        role: request.locals.role,
                        ua: request.locals.ua,
                    });

                if (authToken.error) {
                    throw new CreateError(authToken.msg)
                };

                return {
                    msg: 'Success',
                    data: {
                        token: authToken.data.token
                    }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to refresh bearer token', error);
                throw new Error(error.message);
            }
        }
    })
}