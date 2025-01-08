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
                    throw new CreateError(translate(lang, 'required_medical_rate_code'))
                }
                if (params.description) {
                    entity.description = validate.medicalRateDescription(params.description).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_medical_rate_description'))
                }
                if (params.charge) {
                    entity.charge = validate.medicalRateCharge(params.charge).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_medical_rate_charge'))
                }

                return {
                    msg: 'success',
                    data: { entity }
                }

            } catch (error) {
                logger.error('Failed to create medical rates entity: %s', error);
                if (error instanceof CreateError) {
                    throw error;
                }
                throw new Error(translate(lang, 'error_unknown'))
            }
        }
    })
}
