const models = require('../models').models;

module.exports = ({ translate, logger, CreateError, lang }) => {
    return Object.freeze({
        create: async (params) => {
            try {
                const constructedParams = load(params);
                const create = await models
                    .Specializations
                    .create(constructedParams.updateParams);
                return {
                    msg: `Created specialization successfully`,
                    data: { specializations: unload(create) }
                }
            } catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    throw new CreateError(translate(lang, 'duplicate_specialization'), 409)
                }
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to create specialization  %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        updateByUID: async ({ specializationUID, params }) => {
            try {
                const constructedParams = load(params);
                const update = await models
                    .Specializations
                    .update(constructedParams.updateParams,
                        {
                            where: {
                                uid: specializationUID
                            }
                        });
                return {
                    msg: `Updated specialization details successfully`,
                    data: {}
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to update specialization details: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        findByUID: async (specializationUID) => {
            try {
                const find = await models
                    .Specializations
                    .findOne({
                        where: {
                            uid: specializationUID,
                        }
                    });
                return {
                    msg: `Found specialization  details successfully`,
                    data: { specializations: unload(find) }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find specialization details: %s %s', error.message, error);
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
                    .Specializations
                    .findAll({
                        offset: offset,
                        limit: limit,
                        order: [
                            [sortBy, order]
                        ]
                    });
                const countDoctors = await models
                    .Specializations
                    .count();

                return {
                    msg: `Find all specializations result`,
                    data: {
                        specializations: result,
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
                logger.error('Failed to find all specializations: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        /*
        * @params {uid}uid - uid of the specializations
        * @returns {number} delete count
        */
        deleteByUID: async ({ uid }) => {
            try {
                const status = await models
                    .Specializations
                    .destroy({
                        where: {
                            uid: uid,
                        }
                    });
                return {
                    msg: `Deleted specializations`,
                    data: { deleted: status }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to delete specializations: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        }
    })
}


function unload(params) {
    const data = {
        uid: params.uid,
        specialization: params.specialization,
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
        specialization: 'specialization',
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
