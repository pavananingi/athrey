const fromEntities = require('../../entity');
const stripe = require('../../lib/payment/connection');
const fromPaymentServices = require('../payment-services');

exports.createPayment = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    request,
    db,
    ac,
    payment
}) => {
    return Object.freeze({
        execute: async () => {
            try {
                const lang = request.locals.lang;
                const body = request.body;

                const userUID = request.locals.uid;
                const role = request.locals.role;

                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }

                let permission = ac.can(role).createOwn('paymentIntent');

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).createAny('paymentIntent');
                }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const plansTable = db.methods.AppPlans({ translate, logger, CreateError, lang });

                const planDetails = (await plansTable
                    .findByPlanId({ plan_id: "11103" }))
                    .data.plans;

                if (planDetails === null) {
                    throw new CreateError(translate(lang, 'plan_not_found'))
                }

                // verfy iban
                // IBAN validation: not for freeplan
                if (!(/DE|AT\d{20}/g.test(body.payIban))) {
                    throw new CreateError(translate(lang, 'invalid_pay_iban'))
                }

                if ((/DE|AT\d{20}/g.test(body.payIban))) {
                    const verifyMethods = payment.methods.VerifyMethod({ translate, logger, CreateError, lang });

                    const verifyIban = await verifyMethods.verifyIban({ iban: body.payIban });

                    if (verifyIban.error === true) {
                        throw new CreateError(translate(lang, 'invalid_pay_iban'))
                    }
                }

                // find user
                const usersTable = db.methods.User({
                    translate,
                    logger,
                    CreateError,
                    lang,
                });
                const user = (
                    await usersTable.findByUID({ uid: userUID, includeAll: true })
                ).data.users;

                // customer
                let customerId = user.customer_id;
                if (!customerId) {
                    customerId = (await fromPaymentServices.creatCustomer({
                        CreateError,
                        logger,
                        translate,
                        db,
                        payment,
                        user,
                        lang: lang
                    }))?.data?.customer?.id;
                }
                const customerName = `${user.salute} ${user.firstname} ${user.lastname}`;

                // create payment method
                let paymentMethodGenerate;
                const paymentMethodDetails = {
                    userUid: user.uid,
                    iban: body.payIban,
                    firstname: body.payFirstname,
                    lastname: body.payLastname,
                    type: 'sepa_debit',
                    customer_id: customerId
                }
                paymentMethodGenerate = (await fromPaymentServices.createPaymentMethod({
                    CreateError,
                    logger,
                    translate,
                    db,
                    lang: lang,
                    payment,
                    user: user,
                    paymentMethodDetails,
                })).data.paymentDetails;

                // create stripe subscription
                let subscriptionDetails = {
                    paymentMethodId: paymentMethodGenerate?.id,
                    user_uid: userUID
                };
                const subscription = (await fromPaymentServices.updateSubPaymentMethod({
                    CreateError,
                    logger,
                    translate,
                    db,
                    payment,
                    lang: lang,
                    subscriptionDetails
                })).data.subscription;
                return {
                    msg: translate(lang, 'success'),
                    data: {}
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to create payment: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}