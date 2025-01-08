const models = require('../models').models;
const dbCon = require('../connection').db;
const operators = require('../connection').operators;


module.exports = ({ translate, logger, CreateError, lang }) => {
    return Object.freeze({
        create: async (params) => {
            try {
                const constructedParams = load(params);
                const create = await models
                    .AppPlans
                    .create(constructedParams.updateParams);
                return {
                    msg: `ok`,
                    data: { plans: unload(create) }
                }
            } catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    throw new CreateError(translate(lang, 'duplicate_app_plans'), 409)
                }
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to create app plans: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        updateByStripeId: async ({ stripe_id, params }) => {
            try {
                const constructedParams = load(params);
                const update = await models
                    .AppPlans
                    .update(constructedParams.updateParams,
                        {
                            where: {
                                plan_stripe_id: stripe_id
                            }
                        });
                return {
                    msg: `Updated app plans details successfully`,
                    data: {}
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to update app plans details: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        findByPlanId: async ({ plan_id }) => {
            try {
                const find = await models
                    .AppPlans
                    .findOne({
                        where: {
                            plan_id: plan_id
                        }
                    });
                return {
                    msg: `ok`,
                    data: { plans: find }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find app plan details: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        findAll: async () => {
            try {
                const find = await models
                    .AppPlans
                    .findAll();
                return {
                    msg: `ok`,
                    data: { plans: find }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find app plan details: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        deleteByPlanId: async ({ plan_id }) => {
            try {
                const find = await models
                    .AppPlans
                    .destroy({
                        where: {
                            plan_id: plan_id,
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
                logger.error('Failed to delete plan: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        }
    })
}


function unload(params) {
    const data = {
        id: params.id,
        plan_id: params.plan_id,
        plan_name: params.plan_name,
        total_amount: params.total_amount,
        base_amount: params.base_amount,
        currency: params.currency,
        price_stripe_id: params.price_stripe_id,
        metered_amount: params.metered_amount,
        metered_interval: params.metered_interval,
        tax_name: params.tax_name,
        plan_no_days: params.plan_no_days,
        plan_stripe_id: params.plan_stripe_id,
        created_at: params.created_at,
        updated_at: params.updated_at,
    };
    return data;
}

function load(fields) {
    // param map
    const paramsMap = {
        plan_id: 'plan_id',
        plan_name: 'plan_name',
        total_amount: 'total_amount',
        base_amount: 'base_amount',
        currency: 'currency',
        plan_no_days: 'plan_no_days',
        plan_stripe_id: 'plan_stripe_id',
        price_stripe_id: 'price_stripe_id',
        metered_amount: 'metered_amount',
        metered_interval: 'metered_interval',
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