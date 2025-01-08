module.exports = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    lang,
    params = {
        provider,
        branch_code,
        insurance_code,
        valid_till,
        id_front_uid,
        id_back_uid,
        user_uid
    }
}) => {
    return Object.freeze({
        generate() {
            try {
                const validate = DataValidator({ CreateError, lang, translate });

                let entity = {
                    provider: null,
                    branch_code: null,
                    insurance_code: null,
                    valid_till: null,
                    id_front_uid: null,
                    id_back_uid: null,
                    user_uid: null
                }

                if (params.user_uid) {
                    entity.user_uid = validate.uuid(params.user_uid).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_uid'))
                }

                if (params.provider) {
                    entity.provider = validate.insuranceProvider(params.provider).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_insurance_provider_name'));
                }

                if (params.branch_code) {
                    entity.branch_code = validate.insuranceBranchCode(params.branch_code).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_insurance_branch_code'));
                }

                if (params.insurance_code) {
                    entity.insurance_code = validate.insuranceCode(params.insurance_code).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_insurance_code'));
                }

                if (params.valid_till) {
                    entity.valid_till = validate.insuranceValidity(params.valid_till).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_insurance_valid_till'))
                }

                if (params.id_back_uid) {
                    entity.id_back_uid = validate.uuid(params.id_back_uid).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_insurance_back_doc'))
                }

                if (params.id_front_uid) {
                    entity.id_front_uid = validate.uuid(params.id_front_uid).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_insurance_front_doc'))
                }

                return {
                    msg: 'success',
                    data: { entity }
                }

            } catch (error) {
                logger.error('Failed to create insurance entity: %s', error);
                if (error instanceof CreateError) {
                    throw error;
                }
                throw new Error(translate(lang, 'error_unknown'))
            }
        }
    })
}
