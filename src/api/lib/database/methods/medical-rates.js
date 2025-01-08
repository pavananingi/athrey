const models = require('../models').models;

module.exports = ({ translate, logger, CreateError, lang }) => {
    return Object.freeze({
        create: async (params) => {
            try {
                const constructedParams = load(params);
                const create = await models
                    .MedicalRates
                    .create(constructedParams.updateParams);
                return {
                    msg: `Created medical-rates successfully`,
                    data: { medicalRates: unload(create.dataValues) }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to create medical-rates: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        findByID: async ({ id }) => {
            try {
                const find = await models
                    .MedicalRates
                    .findOne({
                        where: {
                            id: id,
                        }
                    });
                return {
                    msg: `Found medical-rates successfully`,
                    data: { medicalRates: find }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find medical-rates: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        updateByID: async ({ id, params }) => {
            try {
                const constructedParams = load(params);
                const update = await models
                    .MedicalRates
                    .update(constructedParams.updateParams, {
                        where: {
                            id: id,
                        }
                    });
                return {
                    msg: `updated medical-rates successfully`,
                    data: {}
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to update medical-rates: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        findAll: async () => {
            try {
                const result = await models
                    .MedicalRates
                    .findAll({
                        limit: 100,
                        order: [
                            ['code', 'ASC']
                        ]
                    });

                return {
                    msg: `Find medical-rates result`,
                    data: {
                        medicalRates: result
                    }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find medical-rates: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        /*
     * @params {id}id - id of the medical-rates
     * @returns {number} delete count
     */
        deleteByID: async ({ id }) => {
            try {
                const status = await models
                    .MedicalRates
                    .destroy({
                        where: {
                            id: id
                        }
                    });
                return {
                    msg: `Deleted medical-rates`,
                    data: { deleted: status }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to delete medical-rates: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
    })
}

function load(fields) {
    // param map
    const paramsMap = {
        code: 'code',
        description: 'description',
        charge: 'charge',
    };

    let updateParams = {};

    for (const param in fields) {
        const key = paramsMap[param];
        updateParams[key] = fields[param];
    }

    return { updateParams }
}


function unload(params) {

    if (!params) {
        return null;
    }

    const data = {
        id: params.id,
        code: params.code,
        description: params.description,
        charge: params.charge,
        created_at: params.created_at,
        updated_at: params.updated_at,
    };
    return data;
}

