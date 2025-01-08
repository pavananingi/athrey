const fromPayment = require('./connection');

module.exports = ({ translate, logger, CreateError, lang = 'de' }) => {
    const stripeCon = fromPayment;

    return Object.freeze({
        create: async ({ customerId, item }) => {
            try {
                if (!customerId) {
                    throw new CreateError(translate(lang, 'invalid_customer_id'), 422)
                }

                const itemsParams = load(item).updateParams;
                const invoiceItem = await stripeCon.invoiceItems
                    .create({
                        customer: customerId,
                        ...itemsParams
                    });

                return {
                    data: { invoiceItem: invoiceItem },
                    msg: 'success'
                };

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to create the invoice item %s', error);
                throw new Error(translate(lang, 'error_unknown'));
            }
        },
        findByID: () => 'Method not implemented'
    });

}


function load(fields) {
    // param map
    const paramsMap = {
        amount: 'amount',
        currency: 'currency',
        description: 'description'
    };

    let updateParams = {};

    for (const param in fields) {
        const key = paramsMap[param];
        if (key) {
            updateParams[key] = fields[param];
        }
    }

    return { updateParams }
}
