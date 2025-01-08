const fromPayment = require('./connection');

/* If tax rate change in future then
plz make changes in current plan too(in amount)*/

module.exports = ({ translate, logger, CreateError, lang = 'de' }) => {
    const stripeCon = fromPayment;

    return Object.freeze({
        createAndAttachSources: async ({ paymentMethodDetails, user }) => {
            try {
                let paymentMethod = undefined;

                const customerName = `${paymentMethodDetails.firstname} ${paymentMethodDetails.lastname}`;

                // generate payment method
                const paymentMethodError = await stripeCon.sources.create({
                    type: paymentMethodDetails.type || 'sepa_debit',
                    owner: {
                        name: customerName,
                        address: {
                            line1: `${user.address_line_1} ${user.address_line_2}`,
                            city: user.city,
                            // country: paymentMethodDetails.user_country, // Alpha numeric country code
                            postal_code: user.postal_code
                        },
                        email: user.email,
                    },
                    currency: "eur",
                    sepa_debit: {
                        iban: paymentMethodDetails.iban
                    },
                    statement_descriptor: 'Athrey'
                }).then(details => {
                    paymentMethod = details;
                    return true;
                }).catch(error => {
                    return error.message;
                });

                // if payment source creation failed
                if (paymentMethodError !== true) {
                    throw new CreateError(translate(lang, 'payment_method_failed'))
                }
                // attach payment source to customer
                const attachPayment = await stripeCon.customers.createSource(paymentMethodDetails.customer_id, {
                    source: paymentMethod.id,
                });

                // make user default payment source
                const makeDefaultSource = await stripeCon.customers.update(
                    paymentMethodDetails.customer_id,
                    {
                        invoice_settings: {
                            default_payment_method: paymentMethod.id
                        }
                    }
                );

                return {
                    msg: translate(lang, 'success'),
                    data: { details: paymentMethod },
                };
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed subscription with payment gateway %s', error);
                throw new Error(translate(lang, 'error_unknown'));
            }
        },
    });
}