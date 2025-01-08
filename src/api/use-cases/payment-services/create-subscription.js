const tax_stripe_id = require('../../../config/stripe.config.json')[process.env.NODE_ENV].defaultTaxRate;

module.exports = async ({
    CreateError,
    logger,
    translate,
    lang,
    db,
    payment,
    subscriptionDetails
}) => {
    try {
        // plan details
        const plansTable = db.methods.AppPlans({ translate, logger, CreateError, lang });

        const planDetails = (await plansTable
            .findByPlanId({ plan_id: subscriptionDetails.plan_id }))
            .data.plans;

        if (planDetails === null) {
            throw new CreateError(translate(lang, 'plan_not_found'))
        }

        // sub table
        const subscriptionTable = db.methods.Subscriptions({ translate, logger, CreateError, lang });

        // find sub
        const findsubscription = (await subscriptionTable
            .findByUserUID({ user_uid: subscriptionDetails.user_uid }))
            .data.subscription;

        // creating subsciption stripe
        const subscriptionMethods = payment.methods.Subscription({ translate, logger, CreateError, lang });

        const cancel_at = parseInt((new Date().getTime() + 1000 * 60 * 60 * 24 * 365) / 1000);

        const createSubscription = (await subscriptionMethods.createSubscription({ ...subscriptionDetails, plan_stripe_id: planDetails.plan_stripe_id, price_stripe_id: planDetails.price_stripe_id, tax_stripe_id: tax_stripe_id, prevSub: findsubscription, cancel_at })).data.subscription;

        let subitem_stripe_id = "";
        createSubscription
            .items
            .data
            .forEach(item => {
                if (item?.plan?.usage_type == 'metered') {
                    subitem_stripe_id = item.id
                }
            })

        let subDetailsObj = {
            user_uid: subscriptionDetails.user_uid,
            start_date: new Date(),
            sub_stripe_id: createSubscription.id,
            plan_id: subscriptionDetails.plan_id,
            subitem_stripe_id: subitem_stripe_id
        };
        const setTIme = new Date(1970, 0, 1);
        const setCA = new Date(1970, 0, 1);

        if (subscriptionDetails.plan_trail) {
            subDetailsObj.status = 'trial';
            subDetailsObj.active = true;
            subDetailsObj.end_date = setTIme.setSeconds(createSubscription.trial_end);
        } else if (!findsubscription) {
            subDetailsObj.status = 'paid';
            subDetailsObj.active = false;
            subDetailsObj.end_date = new Date();
            subDetailsObj.cancel_time = new Date(setCA.setSeconds(cancel_at))
        }

        // create or update
        if (findsubscription === null) {
            const subscription = (await subscriptionTable
                .create(subDetailsObj))
                .data.subscription;
        }

        return {
            data: { subscription: createSubscription },
            msg: 'success'
        };

    } catch (error) {
        if (error instanceof CreateError) {
            throw error;
        }
        logger.error('Failed create customer in the payment gateway %s', error);
        throw new Error(translate(lang, 'error_unknown'));
    }
}