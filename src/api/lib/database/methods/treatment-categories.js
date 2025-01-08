const models = require('../models').models;

module.exports = ({ translate, logger, CreateError, lang }) => {
    return Object.freeze({
        createBulk: async (params) => {
            try {
                const constructedParams = bulkLoad(params);
                const create = await models
                    .TreatmentCategories
                    .bulkCreate(constructedParams.updateParams, { returning: true });
                return {
                    msg: `Created treatment categories successfully`,
                    data: { treatmentCategories: create }
                }
            } catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    throw new CreateError(translate(lang, 'duplicate_category'), 409)
                }
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to create treatment categories: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        /*
         * @param [uuid]categoryUID - uid of the category
         * @param [object]params - params to update
         * @returns 
         */
        updateByUID: async ({ categoryUID, params }) => {
            try {
                const constructedParams = load(params);
                const update = await models
                    .TreatmentCategories
                    .update(constructedParams.updateParams,
                        {
                            where: {
                                uid: categoryUID,
                            }
                        });
                return {
                    msg: `Updated treatment category details successfully`,
                    data: {}
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to update treatment category details: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        findByUID: async (categoryUID) => {
            try {
                const find = await models
                    .TreatmentCategories
                    .findOne({
                        include: [{
                            model: models.Treatments,
                            as: 'treatments',
                            required: false,
                        }],
                        where: {
                            uid: categoryUID,
                        }
                    });
                return {
                    msg: `Found treatment category details successfully`,
                    data: { categories: find ? unload(find) : find }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find treatment category details: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
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
                    .TreatmentCategories
                    .findAll({
                        include: [{
                            model: models.Treatments,
                            as: 'treatments',
                            required: false,
                        }],
                        offset: offset,
                        limit: limit,
                        order: [
                            [sortBy, order]
                        ]
                    });
                const countDoctors = await models
                    .TreatmentCategories
                    .count();

                return {
                    msg: `Find all treatment categories result`,
                    data: {
                        categories: result,
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
                logger.error('Failed to find all categories: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        /*
       * @params {uid}uid - uid of the category
       * @returns {number} delete count
       */
        deleteByUID: async ({ uid }) => {
            try {
                const status = await models
                    .TreatmentCategories
                    .destroy({
                        where: {
                            uid: uid,
                        }
                    });
                return {
                    msg: `Deleted category`,
                    data: { deleted: status }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to delete category: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
    })
}


function unload(params) {
    const data = {
        uid: params.uid,
        category: params.category,
        treatments: params.treatments,
        created_at: params.created_at,
        updated_at: params.updated_at,
    };

    return data;
}

function bulkLoad(fields) {

    let updateParams = [];

    for (const param in fields) {
        updateParams.push({ category: fields[param] })
    }

    return { updateParams }
}

function load(fields) {
    // param map
    const paramsMap = {
        category: 'category'
    };

    let updateParams = {};

    for (const param in fields) {
        const key = paramsMap[param];
        updateParams[key] = fields[param];
    }

    return { updateParams }
}
