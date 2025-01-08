exports.Logout = ({
    CreateError,
    logger,
    translate,
    request,
    store,
    db
}) => {
    return Object.freeze({
        execute: async () => {
            try {
                const lang = request.locals.lang;
                const userUID = request.locals.uid;

                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_request'));
                }

                const storeToken = (await store.Store({ lang, CreateError, translate, logger })
                    .deleteRefreshToken({
                        token: request.locals.refreshToken,
                        userUID: userUID,
                    }));

                const deviceId = request.body.device_id;

                if (deviceId) {
                    const deleteDevice = db.methods
                        .NotificationDevice({ translate, logger, CreateError, lang })
                        .deleteByDeviceId({
                            userUID: userUID,
                            deviceId: deviceId
                        });
                }

                return {
                    msg: translate(lang, 'logout_success'),
                    data: {}
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to logout: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}