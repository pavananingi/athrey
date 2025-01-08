module.exports = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    lang,
    params = {
        plan_id,
        plan_name,
        amount,
        currency,
        interval,
        interval_count,
    }
}) => {
    return Object.freeze({
        async generate() {
            try {
                const validate = DataValidator({ CreateError, lang, translate });

                let entity = {
                    plan_id: null,
                    plan_name: null,
                    price_name: null,
                    total_amount: null,
                    base_amount: null,
                    currency: null,
                    plan_no_days: null,
                }

                if (params.plan_id) {
                    entity.plan_id = validate.toString(params.plan_id).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_plan_id'));
                }

                if (params.plan_name) {
                    entity.plan_name = validate.toString(params.plan_name).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_plan_name'));
                }

                if (params.price_name) {
                    entity.price_name = validate.toString(params.price_name).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_plan_name'));
                }

                if (params.currency) {
                    entity.currency = validate.toString(params.currency).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_currency'));
                }

                if (params.amount && params.amount >= 0) {
                    let totalamount = parseInt(params.amount);
                    let baseamount = (parseInt(params.amount) / 100).toFixed(2);

                    if (params.tax_rate_percent) {
                        totalamount += (totalamount * parseInt(params.tax_rate_percent)) / 100
                    }
                    totalamount = (totalamount / 100).toFixed(2);
                    entity.total_amount = totalamount;
                    entity.base_amount = baseamount;
                } else {
                    throw new CreateError(translate(lang, 'required_amount'));
                }

                if (params.interval && params.interval_count) {
                    if (params.interval == 'month') {
                        entity.plan_no_days = 30 * parseInt(params.interval_count)
                    } else if (params.interval == 'day') {
                        entity.plan_no_days = 1 * parseInt(params.interval_count)
                    } else if (params.interval == 'week') {
                        entity.plan_no_days = 7 * parseInt(params.interval_count)
                    } else if (params.interval == 'year') {
                        entity.plan_no_days = 365 * parseInt(params.interval_count)
                    } else {
                        throw new CreateError(translate(lang, 'required_interval'));
                    }
                } else {
                    throw new CreateError(translate(lang, 'required_interval'));
                }

                return {
                    msg: 'success',
                    data: { entity }
                }

            } catch (error) {
                logger.error('Failed to create plan entity: %s', error);
                if (error instanceof CreateError) {
                    throw error;
                }
                throw new Error(translate(lang, 'error_unknown'))
            }
        }
    })
}
