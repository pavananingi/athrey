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
        // sub table
        const subscriptionTable = db.methods.Subscriptions({ translate, logger, CreateError, lang });

        // find sub
        const findsubscription = (await subscriptionTable
            .findByUserUID({ user_uid: subscriptionDetails.user_uid }))
            .data.subscription;

        // creating subsciption stripe
        const subscriptionMethods = payment.methods.Subscription({ translate, logger, CreateError, lang });

        const updateSubMethod = (await subscriptionMethods.updateSubMethod({ ...subscriptionDetails, sub_stripe_id: findsubscription.sub_stripe_id })).data.subscription;

        return {
            data: { subscription: updateSubMethod },
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