module.exports = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    lang,
    params = {
        code,
        description,
        charge
    }
}) => {
    return Object.freeze({
        generate() {
            try {
                const validate = DataValidator({ CreateError, lang, translate });

                let entity = {
                    code: null,
                    description: null,
                    charge: null
                }

                if (params.code) {
                    entity.code = validate.medicalRateCode(params.code).data.value;
                } else {
                    delete entity.code;
                }
                if (params.description) {
                    entity.description = validate.medicalRateDescription(params.description).data.value;
                } else {
                    delete entity.description;
                }
                if (params.charge) {
                    entity.charge = validate.medicalRateCharge(params.charge).data.value;
                } else {
                    delete entity.charge
                }

                return {
                    msg: 'success',
                    data: { entity }
                }

            } catch (error) {
                logger.error('Failed to generate update medical rates entity: %s', error);
                if (error instanceof CreateError) {
                    throw error;
                }
                throw new Error(translate(lang, 'error_unknown'))
            }
        }
    })
}
