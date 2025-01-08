const models = require('../models').models;

module.exports = ({ translate, logger, CreateError, lang }) => {
    return Object.freeze({
        create: async (params) => {
            try {
                const constructedParams = load(params);
                const create = await models
                    .Insurance
                    .create(constructedParams.updateParams);
                return {
                    msg: `Created insurance successfully`,
                    data: { insurances: unload(create.dataValues) }
                }
            } catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    throw new CreateError(translate(lang, 'duplicate_cocument'), 409)
                }
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to create insurance: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        findByUID: async ({ insuranceUID }) => {
            try {
                const find = await models
                    .Insurance
                    .findOne({
                        where: {
                            uid: insuranceUID,
                        }
                    });
                return {
                    msg: `Found insurance successfully`,
                    data: { insurances: find ? unload(find) : find }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find insurance: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        findByUserUID: async ({ userUID }) => {
            try {
                const result = await models
                    .Insurance
                    .findOne({
                        where: { user_uid: userUID },
                    });

                return {
                    msg: `Find insurance result`,
                    data: {
                        insurances: result ? unload(result) : result
                    }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find insurance: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        /*
      * @params { number } offset - records to offset,
      * @params { number } limit - records to fetch,
      * @params { string } sortBy - name of the column to sort
      * @params { string } order - 'ASC' | 'DESC'
      * @returns [object|null]Insurance
      */
        findAllByUserUID: async ({ offset, limit, sortBy, order, userUID }) => {
            try {
                const sortableColumns = ["created_at", "updated_at"];

                if (limit) {
                    limit = parseInt(limit);
                } else {
                    limit = 100;
                }

                if (offset) {
                    offset = parseInt(offset);
                } else {
                    offset = 0;
                }

                if (sortBy) {
                    sortBy = sortBy;
                } else {
                    sortBy = 'created_at';
                }

                if (order) {
                    order = order.toUpperCase();
                } else {
                    order = 'DESC';
                }

                const result = await models
                    .Insurance
                    .findAll({
                        where: { user_uid: userUID },
                        offset: offset,
                        limit: limit,
                        order: [
                            [sortBy, order]
                        ]
                    });
                const count = await models
                    .Insurance
                    .count();

                return {
                    msg: `Find all insurance result`,
                    data: {
                        insurances: result,
                        offset,
                        limit,
                        sortBy,
                        sortableColumns: sortableColumns,
                        total: count,
                        order
                    }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find all insurance: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        /*
     * @params {uid}uid - uid of the insurance
     * @params {uid}uid - uid of the user
     * @returns {number} delete count
     */
        deleteByUID: async ({ insuranceUID, userUID }) => {
            try {
                const status = await models
                    .Insurance
                    .destroy({
                        where: {
                            uid: insuranceUID,
                            user_uid: userUID,
                        }
                    });
                return {
                    msg: `Deleted insurance`,
                    data: { deleted: status }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to delete insurance: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
    })
}

function load(fields) {
    // param map
    const paramsMap = {
        user_uid: 'user_uid',
        provider: 'provider',
        branch_code: 'branch_code',
        insurance_code: 'insurance_code',
        valid_till: 'valid_till',
        id_front_uid: 'id_front_uid',
        id_back_uid: 'id_back_uid',
    };

    let updateParams = {};

    for (const param in fields) {
        const key = paramsMap[param];
        updateParams[key] = fields[param];
    }

    return { updateParams }
}


function unload(params) {
    const data = {
        uid: params.uid,
        user_uid: params.user_uid,
        provider: params.provider,
        branch_code: params.branch_code,
        insurance_code: params.insurance_code,
        valid_till: params.valid_till,
        id_front_uid: params.id_front_uid,
        id_back_uid: params.id_back_uid,
        created_at: params.created_at,
        updated_at: params.updated_at,
    };
    return data;
}

