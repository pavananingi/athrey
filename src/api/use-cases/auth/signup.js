const fromEntities = require('../../entity');
const fromPaymentServices = require('../payment-services');

exports.Signup = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    crypto,
    request,
    db,
    mailer,
    payment
}) => {
    return Object.freeze({
        execute: async () => {
            try {
                const lang = request.locals.lang;
                const body = request.body;

                let freePlan = body.plan_trail ? true : false;
                if (!body.hasOwnProperty('plan_trail')) {
                    freePlan = true
                }


                if (body.role == 'doctor') {
                    throw new CreateError(translate(lang, "forbidden"), 403);
                }

                // if (body.role == 'doctor') {
                //     // IBAN validation: not for freeplan
                //     if (!(/DE|AT\d{20}/g.test(body.payIban)) && !freePlan) {
                //         throw new CreateError(translate(lang, 'invalid_pay_iban'))
                //     }

                //     if ((/DE|AT\d{20}/g.test(body.payIban)) && !freePlan) {
                //         const verifyMethods = payment.methods.VerifyMethod({ translate, logger, CreateError, lang });

                //         const verifyIban = await verifyMethods.verifyIban({ iban: body.payIban });

                //         if (verifyIban.error === true) {
                //             throw new CreateError(translate(lang, 'invalid_pay_iban'))
                //         }
                //     }
                // }

                let entity = (fromEntities.entities
                    .Auth
                    .CreateSignup({
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

                // create user
                const createUser = (await usersTable.create({ ...entity, is_active: true })).data.users;

                if (entity.role == 'doctor') {
                    // create stripe customer
                    // const customer = (await fromPaymentServices.creatCustomer({
                    //     CreateError,
                    //     logger,
                    //     translate,
                    //     db,
                    //     payment,
                    //     user: createUser,
                    //     lang: lang
                    // })).data.customer;

                    // let paymentMethodGenerate;
                    // if (customer?.id && !freePlan) {
                    // const paymentMethodDetails = {
                    //     userUid: createUser.uid,
                    //     iban: body.payIban,
                    //     firstname: body.payFirstname,
                    //     lastname: body.payLastname,
                    //     type: 'sepa_debit',
                    //     customer_id: customer.id
                    // }
                    // paymentMethodGenerate = (await fromPaymentServices.createPaymentMethod({
                    //     CreateError,
                    //     logger,
                    //     translate,
                    //     db,
                    //     lang: lang,
                    //     payment,
                    //     user: createUser,
                    //     paymentMethodDetails,
                    // })).data.paymentDetails;
                    // }

                    // create stripe subscription
                    // let subscriptionDetails = {
                    //     customer_id: customer.id,
                    //     plan_id: "11103",
                    //     user_uid: createUser.uid,
                    //     paymentMethodId: paymentMethodGenerate?.id,
                    //     plan_trail: freePlan
                    // };
                    // const subscription = (await fromPaymentServices.createSubscription({
                    //     CreateError,
                    //     logger,
                    //     translate,
                    //     db,
                    //     payment,
                    //     lang: lang,
                    //     subscriptionDetails
                    // })).data.subscription;
                }

                // create a role for the user
                const createRole = (await db.methods.Role({ translate, logger, CreateError, lang })
                    .create({
                        user_uid: createUser.uid,
                        patient: entity.role === 'patient' ? true : false,
                        doctor: entity.role === 'doctor' ? true : false,
                    }));


                // send mail for patient
                if (entity.role === 'patient') {
                    mailer.methods.Send({ CreateError, translate, logger, lang })
                        .signup({
                            to: createUser.email,
                            salute: createUser.salute,
                            title: createUser.title,
                            firstname: createUser.firstname,
                            lastname: createUser.lastname,
                            isPatient: entity.role === 'patient' ? true : false,
                            isDoctor: entity.role === 'doctor' ? true : false,
                        })
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