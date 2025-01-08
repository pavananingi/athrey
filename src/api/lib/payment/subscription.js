const fromPayment = require('./connection');

/* If tax rate change in future then
plz make changes in current plan too(in amount)*/

module.exports = ({ translate, logger, CreateError, lang = 'de' }) => {
    const stripeCon = fromPayment;

    return Object.freeze({
        createSubscription: async (customerDetails) => {
            try {
                if (!customerDetails.customer_id) {
                    throw new CreateError(translate(lang, 'required_customer'))
                }

                let items = [
                    {
                        plan: customerDetails.plan_stripe_id,
                    },
                    {
                        price: customerDetails.price_stripe_id,
                    },
                ];

                // subscription
                let subscriptionDetails = {
                    customer: customerDetails.customer_id,
                    items: items,
                    expand: ['latest_invoice.payment_intent'],
                    metadata: {
                        user_uid: customerDetails.user_uid,
                        plan_id: customerDetails.plan_id
                    },
                };
                if (customerDetails.plan_trail) {
                    subscriptionDetails.trial_period_days = 14
                } else {
                    subscriptionDetails.default_payment_method = customerDetails.paymentMethodId;
                    // subscriptionDetails.cancel_at = customerDetails.cancel_at;
                    subscriptionDetails.default_tax_rates = [customerDetails.tax_stripe_id];
                }

                let subscription;
                subscription = await stripeCon.subscriptions.create(subscriptionDetails);

                return {
                    msg: translate(lang, 'subscription_created_success'),
                    data: { subscription: subscription },
                };

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed subscription with payment gateway %s', error);
                throw new Error(translate(lang, 'error_unknown'));
            }
        },
        updateSubscription: async (customerDetails) => {
            try {
                if (!customerDetails.user_stripe_cus_id) {
                    throw new CreateError(translate(lang, 'required_customer'))
                }

                // subscription
                let subscription;
                subscription = await stripeCon.subscriptions.create({
                    customer: customerDetails.user_stripe_cus_id,
                    items: [
                        {
                            plan: customerDetails.plan_stripe_id,
                        },
                    ],
                    metadata: {
                        user_uid: customerDetails.uid,
                        plan_id: customerDetails.plan_id
                    },
                    trial_period_days: 14,
                });
                return {
                    msg: translate(lang, 'subscription_created_success'),
                    data: { subscription: subscription },
                };

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed subscription with payment gateway %s', error);
                throw new Error(translate(lang, 'error_unknown'));
            }
        },
        updateSubMethod: async (customerDetails) => {
            try {
                // subscription
                let subscription;
                subscription = await stripeCon.subscriptions.update(customerDetails.sub_stripe_id, {
                    trial_end: 'now',
                    default_payment_method: customerDetails.paymentMethodId,
                });

                return {
                    msg: translate(lang, 'subscription_created_success'),
                    data: { subscription: subscription },
                };

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed subscription with payment gateway %s', error);
                throw new Error(translate(lang, 'error_unknown'));
            }
        },
        cancelSubscription: async (sub_stripe_id) => {
            try {
                if (sub_stripe_id) {
                    // cancle previous sub
                    try {
                        const deleted = await stripeCon.subscriptions.del(
                            sub_stripe_id
                        );
                    } catch (error) {
                        console.log("Subscription not found to remove")
                    }
                }
                return {
                    msg: translate(lang, 'success'),
                    data: {},
                };

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed subscription with payment gateway %s', error);
                throw new Error(translate(lang, 'error_unknown'));
            }
        },
        retrieveSubscription: async (sub_stripe_id) => {
            try {
                const subscription = await stripeCon.subscriptions.retrieve(
                    sub_stripe_id
                );
                return {
                    msg: translate(lang, 'success'),
                    data: { subscription },
                };

            } catch (error) {
                return {
                    msg: translate(lang, 'success'),
                    data: { subscription: null },
                };
            }
        }
    });

}