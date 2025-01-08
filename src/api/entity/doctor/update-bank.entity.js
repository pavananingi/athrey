exports.UpdateBankEntity = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    lang,
    params = {
        account_institution_name,
        account_holder_name,
        account_iban,
        account_bic
    }
}) => {
    return Object.freeze({
        generate: () => {
            try {
                const validate = DataValidator({ CreateError, lang, translate });

                let entity = {
                    account_institution_name: null,
                    account_holder_name: null,
                    account_iban: null,
                    account_bic: null
                };

                if (params.account_institution_name) {
                    entity.account_institution_name = validate.account_institution_name(params.account_institution_name).data.value;
                } else {
                    delete entity.account_institution_name;
                }

                if (params.account_holder_name) {
                    entity.account_holder_name = validate.account_holder_name(params.account_holder_name).data.value;
                } else {
                    delete entity.account_holder_name;
                }

                if (params.account_iban) {
                    entity.account_iban = validate.account_iban(params.account_iban).data.value;
                } else {
                    delete entity.account_iban;
                }

                if (params.account_bic) {
                    entity.account_bic = validate.account_bic(params.account_bic).data.value;
                } else {
                    delete entity.account_bic;
                }
                
                return {
                    msg: translate(lang, 'success'),
                    data: { entity }
                }
            } catch (error) {
                logger.error('Failed to update bank entity: %s', error);
                if (error instanceof CreateError) {
                    throw error;
                }
                throw new Error(translate(lang, 'error_unknown'))
            }
        }
    })
}