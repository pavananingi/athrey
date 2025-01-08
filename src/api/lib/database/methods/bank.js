const models = require('../models').models;

exports.BankDetails = ({ translate, logger, CreateError, lang }) => {
    return Object.freeze({
        /*
         * @param [uuid]userUID - uid of the user
         * @param [object]params - params to update
         * @returns 
         */
        updateByUserUID: async (userUID, params) => {
            try {
                const constructedParams = load(params);
                const updateDoctor = await models
                    .DoctorDetails
                    .update(constructedParams.updateParams,
                        {
                            where: {
                                user_uid: userUID,
                            }
                        });

                return {
                    msg: `Updated doctor details successfully`,
                    data: {}
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to update doctor details: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        /*
         * @param { uuid }userUID - uid of the user
         * @returns 
         */
        findByUserUID: async ({ userUID }) => {
            try {
                const findDoctor = await models
                    .DoctorDetails
                    .findOne({
                        where: {
                            user_uid: userUID,
                        }
                    });

                return {
                    msg: `Find doctor result`,
                    data: { doctors: findDoctor === null ? null : unload(findDoctor.dataValues) }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find doctor: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
    })
}


function unload(params) {
    const data = {
        user_uid: params.user_uid,
        account_institution_name: params.account_institution_name,
        account_holder_name: params.account_holder_name,
        account_iban: params.account_iban,
        account_bic: params.account_bic
    };
    return data;
}

function load(fields) {
    // param map
    const paramsMap = {
        user_uid: 'user_uid',
        account_institution_name: "account_institution_name",
        account_holder_name: "account_holder_name",
        account_iban: "account_iban",
        account_bic: "account_bic"
    };

    let updateParams = {};

    for (const param in fields) {
        const key = paramsMap[param];
        updateParams[key] = fields[param];
    }

    return { updateParams }
}


