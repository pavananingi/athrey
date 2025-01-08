const models = require('../models').models;
const dbCon = require('../connection').db;
const operators = require('../connection').operators;


module.exports = ({ translate, logger, CreateError, lang }) => {
    return Object.freeze({
        create: async (params) => {
            try {
                const constructedParams = load(params);
                const create = await models
                    .docGenerator
                    .create(constructedParams.updateParams);
                return {
                    msg: `ok`,
                    data: unload(create)
                }
            } catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    throw new CreateError(translate(lang, 'duplicate_app_plans'), 409)
                }
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to create doc gen: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
    })
}


function unload(params) {
    const data = {
        id: params.id,
        consultation: params.consultation,
        type: params.type,
        created_at: params.created_at,
        updated_at: params.updated_at,
    };
    return data;
}

function load(fields) {
    // param map
    const paramsMap = {
        consultation: 'consultation',
        type: 'type',
    };
    let updateParams = {};

    for (const param in fields) {
        const key = paramsMap[param];
        updateParams[key] = fields[param];
    }

    return { updateParams }
}

function generateDateFilter({ startDate, endDate }) {
    let whereOptions = {}

    if (startDate) {
        whereOptions = {
            ...whereOptions,
            start_time: {
                [operators.gte]: startDate
            }
        }
    }

    if (endDate) {
        whereOptions = {
            ...whereOptions,
            end_time: {
                [operators.lte]: endDate
            }
        }
    }

    return whereOptions;
}