const fromEntities = require('../../entity');
const fromPaymentServices = require('../payment-services');

exports.Register = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    crypto,
    request,
    db,
    mailer,
    payment,
    store
}) => {
    return Object.freeze({
        execute: async () => {
            try {
                const lang = request.locals.lang;
                const body = request.body;

                if (body.email) {
                    const entity = fromEntities
                        .entities.Auth.VerifyOtp({
                            CreateError,
                            DataValidator,
                            logger,
                            lang,
                            translate,
                            params: { ...request.body },
                        }).generate().data.entity;

                    const latestOTP = (
                        await store
                            .Store({ translate, logger, lang, CreateError })
                            .verifySendOtp({ email: entity.email })
                    ).data.otp;

                    if (latestOTP === null) {
                        throw new CreateError(translate(lang, "otp_expired"), 404);
                    }

                    if (String(entity.otp) !== String(latestOTP)) {
                        throw new CreateError(translate(lang, "invalid_otp"), 401);
                    }

                } else {
                    throw new CreateError(translate(lang, 'invalid_signup_details'))
                }

                let entity = (fromEntities.entities
                    .Auth
                    .CreateRegister({
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

                // create user
                const createUser = (await usersTable.create({ ...entity, is_active: true })).data.users;

                // create a role for the user
                const createRole = (await db.methods.Role({ translate, logger, CreateError, lang })
                    .create({
                        user_uid: createUser.uid,
                        patient: entity.role === 'patient' ? true : false,
                        doctor: entity.role === 'doctor' ? true : false,
                    }));

                // add userUID
                if (entity?.id_cirtificate_uid) {
                    (await db.methods.Documents({ translate, logger, CreateError, lang })
                        .updateByUID({
                            documentUID: entity.id_cirtificate_uid, params: {
                                user_uid: createUser.uid,
                            }
                        }));
                }

                return {
                    msg: translate(lang, 'success_signup'),
                    data: {}
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to signup: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}