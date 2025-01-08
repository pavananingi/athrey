const models = require('../models').models;

module.exports = ({ translate, logger, CreateError, lang }) => {
    return Object.freeze({
        create: async (params) => {
            try {
                const constructedParams = load(params);
                const create = await models
                    .Treatments
                    .create(constructedParams.updateParams);
                return {
                    msg: `Created treatment successfully`,
                    data: { treatments: unload(create) }
                }
            } catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    throw new CreateError(translate(lang, 'duplicate_treatment'), 409)
                }
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to create treatment  %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'))
            }
        },
        updateByID: async ({ id, params }) => {
            try {
                const constructedParams = load(params);
                const update = await models
                    .Treatments
                    .update(constructedParams.updateParams,
                        {
                            where: {
                                id: id
                            }
                        });
                return {
                    msg: `Updated treatment details successfully`,
                    data: {}
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to update treatment details: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'))
            }
        },
        findByID: async (id) => {
            try {
                const find = await models
                    .Treatments
                    .findOne({
                        where: {
                            id: id,
                        }
                    });
                return {
                    msg: `Found treatment  details successfully`,
                    data: { treatments: unload(find) }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find treatment details: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'))
            }
        },
        /*
        * @params { number } offset - records to offset,
        * @params { number } limit - records to fetch,
        * @params { string } sortBy - name of the column to sort
        * @params { string } order - 'ASC' | 'DESC'
        * @returns [object|null]TreatmentCategories
        */
        findAll: async ({ offset, limit, sortBy, order }) => {
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
                    .Treatments
                    .findAll({
                        offset: offset,
                        limit: limit,
                        order: [
                            [sortBy, order]
                        ]
                    });

                const countDoctors = await models
                    .Treatments
                    .count();

                return {
                    msg: `Find all treatments result`,
                    data: {
                        treatments: result,
                        offset,
                        limit,
                        sortBy,
                        sortableColumns: sortableColumns,
                        total: countDoctors,
                        order
                    }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find all treatments: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'))
            }
        },
        /*
         * @params {id}id - id of the treatment
         * @returns {number} delete count
         */
        deleteByID: async ({ id }) => {
            try {
                const status = await models
                    .Treatments
                    .destroy({
                        where: {
                            id: id,
                        }
                    });
                return {
                    msg: `Deleted treatment`,
                    data: { deleted: status }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to delete treatment: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'))
            }
        }
    })
}


function unload(params) {
    const data = {
        id: params.id,
        category_uid: params.category_uid,
        treatment: params.treatment,
        illustration_url: params.illustration_url,
        description: params.description,
        questions: params.questions,
        created_at: params.created_at,
        updated_at: params.updated_at,
    };

    return data;
}


function load(fields) {
    // param map
    const paramsMap = {
        category_uid: 'category_uid',
        treatment: 'treatment',
        illustration_url: 'illustration_url',
        description: 'description',
        questions: 'questions',
    };

    let updateParams = {};

    for (const param in fields) {
        const key = paramsMap[param];
        updateParams[key] = fields[param];
    }

    return { updateParams }
}
