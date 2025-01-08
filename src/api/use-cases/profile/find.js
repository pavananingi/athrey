/*
 * @desc Get profile details
 * @params [uuid]uid - UUID of the user under request.queryParams
 * @returns user 
*/

exports.GetProfile = ({
    CreateError,
    logger,
    translate,
    request,
    db,
    ac,
}) => {
    return Object.freeze({
        execute: async () => {
            try {

                const lang = request.lang;
                const userUID = request.locals.uid;
                const role = request.locals.role;
                const urlParams = request.urlParams;

                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }

                let permission = ac.can(role).readOwn('profile');

                if (urlParams.uid) {
                    if (urlParams.uid !== userUID) {
                        permission = ac.can(role).readAny('profile');
                    }
                }

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).updateAny('profile');
                }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const usersTable = db.methods.User({ translate, logger, CreateError, lang });

                // find user
                let user;
                if (urlParams.uid) {
                    user = (await usersTable
                        .findByUID({ uid: urlParams.uid, includeAll: false }))
                        .data.users;
                } else {
                    user = (await usersTable
                        .findByUID({ uid: userUID, includeAll: false }))
                        .data.users;
                }

                if (user === null) {
                    throw new CreateError(translate(lang, 'account_not_found'), 404);
                }

                return {
                    msg: translate(lang, 'success'),
                    data: { user: permission.filter(user) }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to get profile: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}