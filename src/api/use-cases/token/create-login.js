exports.CreateLoginToken = ({
    CreateError,
    logger,
    translate,
    request,
    db,
    ac,
    token,
    store
}) => {
    return Object.freeze({
        execute: async () => {
            try {

                const lang = request.lang;
                const userUID = request.locals.uid;
                const role = request.locals.role;
                const urlParams = request.urlParams;
                let requestedUserUID;

                if (urlParams.requestedUserUID) {
                    requestedUserUID = urlParams.requestedUserUID;
                } else {
                    throw new CreateError(translate(lang, 'Please provide user UID'));
                }

                if (role !== 'admin' && role !== 'superadmin') {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                permission = ac.can(role).createAny('token');

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const usersTable = db.methods.User({ translate, logger, CreateError, lang });

                const user = (await usersTable
                    .findByUID({ uid: requestedUserUID, includeAll: false }))
                    .data.users;


                if (user === null) {
                    throw new CreateError(translate(lang, 'account_not_found'), 404);
                }

                const tokenGenerator = token.jwt({ CreateError, translate, lang, logger });

                const refreshToken = (await tokenGenerator.generateRefreshToken({
                    uid: user.uid,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    role: 'patient',
                    ua: request.locals.ua
                })).data.token;


                const storeToken = (await store.Store({ lang, CreateError, translate, logger })
                    .storeRefreshToken({
                        token: refreshToken,
                        userUID: user.uid,
                        ip: '',
                        ua: request.locals.ua,
                        type: 'admin-generated'
                    }));

                return {
                    msg: translate(lang, 'success'),
                    data: { token: refreshToken }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to create token: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}