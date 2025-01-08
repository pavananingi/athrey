module.exports = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    lang,
    params = {
        description,
        amount,
        manual_invoice
    }
}) => {
    return Object.freeze({
        async generate() {
            try {
                const validate = DataValidator({ CreateError, lang, translate });

                let entity = {
                    description: null,
                    amount: null,
                    currency: null,
                    manual_invoice: null
                }

                if (params.description) {
                    entity.description = validate.invoiceItemDesc(params.description).data.value;
                } else {
                    entity.description = "None";
                }

                if (params.amount) {
                    if (params.amount > 0) {
                        entity.amount = parseInt(params.amount);
                    } else {
                        throw new CreateError(translate(lang, 'invalid_invoice_item_amount'))
                    }
                } else {
                    entity.amount = 1;
                }

                if (params.manual_invoice) {
                    entity.manual_invoice = params.manual_invoice;
                } else {
                    delete entity.manual_invoice;
                }

                entity.currency = 'eur';

                return {
                    msg: 'success',
                    data: { entity }
                }

            } catch (error) {
                logger.error('Failed to generate create invoice entity: %s', error);
                if (error instanceof CreateError) {
                    throw error;
                }
                throw new Error(translate(lang, 'error_unknown'))
            }
        }
    })
}
