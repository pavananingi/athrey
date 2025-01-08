const models = require('../models').models;
const dbCon = require('../connection').db;
const operators = require('../connection').operators;


module.exports = ({ translate, logger, CreateError, lang }) => {
    return Object.freeze({
        create: async (params) => {
            try {
                const constructedParams = load(params);
                const create = await models
                    .Subscriptions
                    .create(constructedParams.updateParams);
                return {
                    msg: `ok`,
                    data: { subscription: unload(create) }
                }
            } catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    throw new CreateError(translate(lang, 'duplicate_subscriptions'), 409)
                }
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to create subscriptions: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        updateByStripeId: async ({ stripe_id, params }) => {
            try {
                const constructedParams = load(params);
                const update = await models
                    .Subscriptions
                    .update(constructedParams.updateParams,
                        {
                            where: {
                                sub_stripe_id: stripe_id
                            }
                        });
                return {
                    msg: `Updated subcription details successfully`,
                    data: {}
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to update subcription details: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        updateByUserUID: async ({ user_uid, params }) => {
            try {
                const constructedParams = load(params);
                const update = await models
                    .Subscriptions
                    .update(constructedParams.updateParams,
                        {
                            where: {
                                user_uid: user_uid
                            }
                        });
                return {
                    msg: `Updated subcription details successfully`,
                    data: {}
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to update subcription details: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        findByUserUID: async ({ user_uid }) => {
            try {
                const find = await models
                    .Subscriptions
                    .findOne({
                        where: {
                            user_uid: user_uid
                        }
                    });
                return {
                    msg: `ok`,
                    data: { subscription: find }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find subcription details: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        findAll: async () => {
            try {
                const find = await models
                    .Subscriptions
                    .findAll();
                return {
                    msg: `ok`,
                    data: { subscription: find }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find subcription details: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        deleteByUId: async ({ uid }) => {
            try {
                const find = await models
                    .Subscriptions
                    .destroy({
                        where: {
                            user_uid: uid,
                        }
                    });
                return {
                    msg: `Delete`,
                    data: { deleted: find }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to delete subcription: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        }
    })
}


function unload(params) {
    const data = {
        id: params.id,
        user_uid: params.user_uid,
        start_date: params.start_date,
        end_date: params.end_date,
        active: params.active,
        status: params.status,
        sub_stripe_id: params.sub_stripe_id,
        plan_id: params.plan_id,
        cancel_time: params.cancel_time,
        subitem_stripe_id: params.subitem_stripe_id,
        created_at: params.created_at,
        updated_at: params.updated_at,
    };
    return data;
}

function load(fields) {
    // param map
    const paramsMap = {
        user_uid: 'user_uid',
        start_date: 'start_date',
        end_date: 'end_date',
        active: 'active',
        status: 'status',
        sub_stripe_id: 'sub_stripe_id',
        plan_id: 'plan_id',
        cancel_time: 'cancel_time',
        subitem_stripe_id: 'subitem_stripe_id',
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