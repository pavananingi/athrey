module.exports = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    lang,
    params = {
        items,
        total
    }
}) => {
    return Object.freeze({
        async generate() {
            try {
                const validate = DataValidator({ CreateError, lang, translate });

                let entity = {
                    items: [],
                    total: null
                }

                if (params.items) {
                    entity.items = [];
                    const items = params.items;

                    for (let i = 0; i < items.length; i++) {
                        const verifiedItem = {};

                        if (items[i].code) {
                            verifiedItem.code = validate.medicalRateCode(items[i].code).data.value;
                        } else {
                            throw new CreateError(translate(lang, 'required_medical_rate_code'))
                        }
                        if (items[i].description) {
                            verifiedItem.description = validate.medicalRateDescription(items[i].description).data.value;
                        } else {
                            throw new CreateError(translate(lang, 'required_medical_rate_description'))
                        }
                        if (items[i].charge) {
                            verifiedItem.charge = validate.medicalRateCharge(items[i].charge).data.value;
                        } else {
                            throw new CreateError(translate(lang, 'required_medical_rate_charge'))
                        }
                        if (items[i].multiplier) {
                            verifiedItem.multiplier = validate.toString(items[i].multiplier).data.value;
                        } else {
                            throw new CreateError(translate(lang, 'required_medical_rate_multipler'))
                        }
                        if (items[i].total) {
                            verifiedItem.total = validate.medicalRateCharge(items[i].total).data.value;
                        } else {
                            throw new CreateError(translate(lang, 'required_medical_rate_total'))
                        }
                        entity.items.push(verifiedItem);
                    }
                } else {
                    throw new CreateError(translate(lang, 'required_charge_items'))
                }

                if (params.total !== undefined) {
                    entity.total = validate.medicalRateTotal(params.total).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_medical_rate_total'))
                }

                return {
                    msg: 'success',
                    data: { entity }
                }

            } catch (error) {
                logger.error('Failed to create update consultation doctor charge entity: %s', error);
                if (error instanceof CreateError) {
                    throw error;
                }
                throw new Error(translate(lang, 'error_unknown'))
            }
        }
    })
}
