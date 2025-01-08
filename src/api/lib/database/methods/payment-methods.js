const models = require('../models').models;
const dbCon = require('../connection').db;
const operators = require('../connection').operators;


module.exports = ({ translate, logger, CreateError, lang }) => {
    return Object.freeze({
        create: async (params) => {
            try {
                const constructedParams = load(params);
                const create = await models
                    .PaymentMethods
                    .create(constructedParams.updateParams);
                return {
                    msg: `ok`,
                    data: { methods: unload(create) }
                }
            } catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    throw new CreateError(translate(lang, 'duplicate_payment_method'), 409)
                }
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to create payment method: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        updateByUserUID: async ({ user_uid, params }) => {
            try {
                const constructedParams = load(params);
                const update = await models
                    .PaymentMethods
                    .update(constructedParams.updateParams,
                        {
                            where: {
                                user_uid: user_uid
                            }
                        });
                return {
                    msg: `Updated payment method details successfully`,
                    data: {}
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to update payment method details: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        findByUserUID: async ({ user_uid }) => {
            try {
                const find = await models
                    .PaymentMethods
                    .findOne({
                        where: {
                            user_uid: user_uid
                        }
                    });
                return {
                    msg: `ok`,
                    data: { methods: find }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find payment method details: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        findAll: async () => {
            try {
                const find = await models
                    .PaymentMethods
                    .findAll();
                return {
                    msg: `ok`,
                    data: { methods: find }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find payment method details: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        deleteByPlanId: async ({ plan_id }) => {
            try {
                const find = await models
                    .PaymentMethods
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
                logger.error('Failed to delete payment method: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        }
    })
}


function unload(params) {
    const data = {
        id: params.id,
        user_uid: params.user_uid,
        method_stripe_id: params.method_stripe_id,
        cus_id: params.cus_id,
        method: params.method,
        iban: params.iban,
        last_digits: params.last_digits,
        bankcode: params.bankcode,
        branchcode: params.branchcode,
        country: params.country,
        fingerprint: params.fingerprint,
        mandate_id: params.mandate_id,
        mandate_ip: params.mandate_ip,
        firstname: params.firstname,
        lastname: params.lastname,
        address: params.address,
        postal: params.postal,
        city: params.city,
        migrated: params.migrated,
        next_invoice: params.next_invoice,
        next_invoice_amount: params.next_invoice_amount,
        created_at: params.created_at,
        updated_at: params.updated_at,
        status: params.status,
    };
    return data;
}

function load(fields) {
    // param map
    const paramsMap = {
        user_uid: 'user_uid',
        method_stripe_id: 'method_stripe_id',
        cus_id: 'cus_id',
        method: 'method',
        iban: 'iban',
        last_digits: 'last_digits',
        bankcode: 'bankcode',
        branchcode: 'branchcode',
        country: 'country',
        fingerprint: 'fingerprint',
        mandate_id: 'mandate_id',
        mandate_ip: 'mandate_ip',
        firstname: 'firstname',
        lastname: 'lastname',
        address: 'address',
        postal: 'postal',
        city: 'city',
        migrated: 'migrated',
        next_invoice: 'next_invoice',
        next_invoice_amount: 'next_invoice_amount',
        status: 'status',
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