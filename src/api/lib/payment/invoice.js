const fromPayment = require('./connection');

module.exports = ({ translate, logger, CreateError, lang = 'de' }) => {
    const stripeCon = fromPayment;

    return Object.freeze({
        create: async ({ customerId, consultation_uid, doctor_uid }) => {
            try {
                if (!customerId) {
                    throw new CreateError(translate(lang, 'invalid_customer_id'), 422)
                }

                const invoice = await stripeCon.invoices
                    .create({
                        customer: customerId,
                        collection_method: 'send_invoice',
                        description: 'This is the consultation invoice', // memo
                        metadata: {
                            consultation_uid: consultation_uid,
                            doctor_uid: doctor_uid
                        },
                        footer: 'Gute Gesundheit wünscht Ihnen das Athrey.',
                        statement_descriptor: 'Athrey consultation', // 22 characters only,
                        days_until_due: 7,
                    });

                return {
                    data: { invoice: invoice },
                    msg: 'success'
                };

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to create the invoice draft %s', error);
                throw new Error(translate(lang, 'error_unknown'));
            }
        },
        sendInvoice: async ({ invoiceId }) => {
            try {

                const invoice = await stripeCon.invoices
                    .sendInvoice(invoiceId);

                logger.info('Invoice sent: %s', invoiceId)

                return {
                    data: { invoice: invoice },
                    msg: 'success'
                };

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to send the invoice %s', error);
                throw new Error(translate(lang, 'error_unknown'));
            }
        },
        findInvoiceByID: () => 'Method not implemented'
    });

}