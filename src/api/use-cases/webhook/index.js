const invoicePaidMethod = require('./invoice_paid');

exports.webhook = ({
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
                let { data, type } = request.body;
                data = data.object;

                const requestobject = { CreateError, DataValidator, logger, translate, request, db, ac, payment };
                switch (type) {
                    case 'invoice.paid':
                        console.log('Webhook-event: invoice.paid, subscriptionStripeId: ', data.subscription);

                        await invoicePaidMethod
                            .invoice_paid(requestobject)
                            .execute(data)
                        break;
                }
                return {
                    msg: translate(lang, 'success'),
                    data: { received: true }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to update webhooks data: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}