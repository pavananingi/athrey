const fromEntities = require('../../entity');
const url = require('../../../config/app.config.json').originUrl[process.env.NODE_ENV].https;

exports.CreateAdmin = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    crypto,
    request,
    db,
    mailer,
    ac,
}) => {
    return Object.freeze({
        execute: async () => {
            try {
                const lang = request.locals.lang;
                const body = request.body;


                let entity = (fromEntities.entities
                    .Admin
                    .AdminEntity
                    .CreateAdmin({
                        CreateError,
                        DataValidator,
                        logger,
                        translate,
                        crypto,
                        lang,
                        params: { ...body }
                    }).generate()).data.entity;

                const usersTable = db.methods.User({ translate, logger, CreateError, lang });

                // check for the email available or not
                const findUser = (await usersTable.findByEmail({
                    email: entity.email,
                    includeAll: false
                })).data.users;

                if (findUser !== null) {
                    // throw new CreateError(translate(lang, 'email_exists'))
                    throw new CreateError(translate(lang, 'invalid_signup_details'))
                }

                // encrypt password
                const hashedPassword = (await crypto.PasswordHash({
                    CreateError, translate, logger,
                    password: entity.password
                }).hashPassword()).data.hashedPassword;
                entity.password = hashedPassword;

                console.log("entity...", entity)
                // create user
                const createUser = (await usersTable.create({ ...entity, is_active: true })).data.users;

                // create a role for the user
                const createRole = (await db.methods.Role({ translate, logger, CreateError, lang })
                    .create({
                        user_uid: createUser.uid,
                        patient: false,
                        doctor: false,
                        admin: true
                    }));

                return {
                    msg: translate(lang, 'success_signup'),
                    data: {}
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error("Failed to invite: %s", error);
                throw new Error(error.message);
            }
        },
    });
}