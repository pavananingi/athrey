const fromEntity = require('../../entity');
const crypto = require('../../lib/crypto').crypto;
const url = require('../../../config/app.config.json').originUrl[process.env.NODE_ENV].https;

/*
 * @desc Update profile details
 * @params check the respective roles
 * @returns user
*/
exports.UpdateProfile = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    request,
    db,
    ac,
    mailer,
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

                let permission = ac.can(role).updateOwn('profile');

                if (urlParams.uid) {
                    if (urlParams.uid !== userUID) {
                        permission = ac.can(role).updateAny('profile');
                    }
                }

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).updateAny('profile');
                }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                // filter body based on the role
                const body = permission.filter(request.body);
                let email;
                if ((Object.keys(body)).includes('first_login') && !body?.first_login) {
                    email = true;
                }
                // entity builder
                const entity = (fromEntity.entities
                    .Profile.UpdateProfile({
                        CreateError,
                        DataValidator,
                        logger,
                        translate,
                        lang,
                        params: { ...body }
                    }).generate()).data.entity;

                const usersTable = db.methods.User({ translate, logger, CreateError, lang });

                // update user
                let updateUID;
                if (urlParams.uid) {
                    updateUID = urlParams.uid;
                } else {
                    updateUID = userUID;
                }

                const updateProfile = (await usersTable
                    .updateByUID({ uid: updateUID, params: entity }));

                const updatedProfile = (await usersTable
                    .findByUID({ uid: updateUID, includeAll: false }))
                    .data.users;


                if (updatedProfile === null) {
                    throw new CreateError(translate(lang, 'user_not_found'), 404);
                }

                // send email to doctor
                if (email) {
                    db.methods
                        .User({ CreateError, logger, lang, translate })
                        .findByUID({ uid: userUID })
                        .then((result) => {
                            const user = result.data.users;
                            if (user && !user.email_verified) {
                                const date = crypto.b64.encode(`${Date.now()}`).data.value;
                                mailer.methods
                                    .Send({ CreateError, translate, logger, lang })
                                    .emailVerify({
                                        to: user.email,
                                        salute: user.salute,
                                        title: user.title,
                                        firstname: user.firstname,
                                        lastname: user.lastname,
                                        verify_link: `${url}/api/en/v1/auth/verifyemail/${userUID}/${date}`
                                    });
                            }
                        });
                }
                return {
                    msg: translate(lang, 'success'),
                    data: { user: updatedProfile }
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