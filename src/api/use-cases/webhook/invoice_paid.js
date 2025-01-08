
exports.invoice_paid = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    request,
    db,
    ac,
    payment,
}) => {
    return Object.freeze({
        execute: async (data) => {
            if (data.status !== 'paid' || data.amount_paid <= 0) {
                return {
                    received: true
                }
            }

            try {
                const lang = request.locals.lang;
                const subscriptionTable = db.methods.Subscriptions({ translate, logger, CreateError, lang });

                // fetch stripe subcription
                const subscriptionMethods =
                    payment.methods.Subscription({ translate, logger, CreateError, lang });

                const fetchSubscription = (await subscriptionMethods.retrieveSubscription(data.subscription)).data.subscription;


                if (fetchSubscription) {
                    // set time 
                    const setStartTime = new Date(1970, 0, 1);
                    const setEndTime = new Date(1970, 0, 1);

                    const subcriptionDb = (await subscriptionTable
                        .findByUserUID({
                            user_uid: fetchSubscription.metadata.user_uid
                        }))
                        .data.subscription

                    const setCancelTime = new Date(1970, 0, 1);

                    let cancel_at = subcriptionDb?.cancel_at;
                    if (!cancel_at) {
                        cancel_at = new Date(setCancelTime.setSeconds(fetchSubscription.current_period_start + 60 * 60 * 24 * 365));
                    } else if ((new Date().getTime() - new Date(cancel_at).getTime()) < 0) {
                        cancel_at = new Date(setCancelTime.setSeconds(new Date(cancel_at).getTime() + 60 * 60 * 24 * 365));
                    }

                    // update subscription
                    const subscription = (await subscriptionTable
                        .updateByUserUID({
                            user_uid: fetchSubscription.metadata.user_uid,
                            params: {
                                active: true,
                                status: 'paid',
                                plan_id: fetchSubscription?.metadata?.plan_id,

                                start_date: setStartTime.setSeconds(fetchSubscription.current_period_start),
                                end_date: setEndTime.setSeconds(fetchSubscription.current_period_end),

                                cancel_time: cancel_at,

                                sub_stripe_id: fetchSubscription.id
                            }
                        }))
                        .data.subscription;

                    // user update
                    const usersTable = db.methods.User({
                        translate,
                        logger,
                        CreateError,
                        lang,
                    });

                    const updateUser = (await usersTable.updateByEmail(
                        {
                            email: data.customer_email,
                            params: {
                                payable_call_duration: 0
                            }
                        }
                    ));

                    // payment method
                    const paymentMethodTable = db.methods.PaymentMethods({ translate, logger, CreateError, lang });

                    const updatePaymentMethod = (await paymentMethodTable.updateByUserUID(
                        {
                            user_uid: fetchSubscription.metadata.user_uid,
                            params: {
                                status: 'succeed'
                            }
                        }
                    ));
                }
                return {
                    received: true
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to update payment webhook invoice paid: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}