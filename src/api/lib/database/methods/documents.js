const models = require('../models').models;

module.exports = ({ translate, logger, CreateError, lang }) => {
    return Object.freeze({
        create: async (params) => {
            try {
                const constructedParams = load(params);
                const create = await models
                    .Documents
                    .create(constructedParams.updateParams);
                return {
                    msg: `Created document successfully`,
                    data: { documents: unload(create.dataValues) }
                }
            } catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    throw new CreateError(translate(lang, 'duplicate_cocument'), 409)
                }
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to create document: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        createBulk: async (params) => {
            try {
                const constructedParams = bulkLoad(params);
                const create = await models
                    .Documents
                    .bulkCreate(constructedParams.updateParams, { returning: true });
                return {
                    msg: `Created documents successfully`,
                    data: { documents: create }
                }
            } catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    throw new CreateError(translate(lang, 'duplicate_cocument'), 409)
                }
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to create documents: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        findByUID: async ({ documentUID }) => {
            try {
                const find = await models
                    .Documents
                    .findOne({
                        where: {
                            uid: documentUID,
                            deleted: false
                        }
                    });
                return {
                    msg: `Found document successfully`,
                    data: { documents: find ? unload(find) : find }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find document: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        updateByUID: async ({ documentUID, params }) => {
            try {
                const constructedParams = load(params);
                const update = await models
                    .Documents
                    .update(constructedParams.updateParams, {
                        where: {
                            uid: documentUID,
                        }
                    });
                return {
                    msg: `Updated`,
                    data: {}
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to update document: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        /*
      * @params { number } offset - records to offset,
      * @params { number } limit - records to fetch,
      * @params { string } sortBy - name of the column to sort
      * @params { string } order - 'ASC' | 'DESC'
      * @returns [object|null]Documents
      */
        findAllbyUserUID: async ({ offset, limit, sortBy, order, userUID }) => {
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
                    .Documents
                    .findAll({
                        where: {
                            user_uid: userUID,
                            deleted: false
                        },
                        offset: offset,
                        limit: limit,
                        order: [
                            [sortBy, order]
                        ]
                    });
                const countDocuments = await models
                    .Documents
                    .count({
                        where: {
                            deleted: false
                        }
                    });

                return {
                    msg: `Find all documents result`,
                    data: {
                        documents: result,
                        offset,
                        limit,
                        sortBy,
                        sortableColumns: sortableColumns,
                        total: countDocuments,
                        order
                    }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find all documents: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        findAllbyUID: async ({ offset, limit, sortBy, order, uid }) => {
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
                    .Documents
                    .findAll({
                        where: {
                            uid: uid,
                            deleted: false
                        },
                        // offset: offset,
                        // limit: limit,
                        order: [
                            [sortBy, order]
                        ]
                    });
                const countDocuments = await models
                    .Documents
                    .count({
                        where: {
                            deleted: false
                        }
                    });

                return {
                    msg: `Find all documents result`,
                    data: {
                        documents: result,
                        offset,
                        limit,
                        sortBy,
                        sortableColumns: sortableColumns,
                        total: countDocuments,
                        order
                    }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find all documents: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        /*
        /*

      * @params { number } offset - records to offset,
      * @params { number } limit - records to fetch,
      * @params { string } sortBy - name of the column to sort
      * @params { string } order - 'ASC' | 'DESC'
      * @returns [object|null]Documents
      */
        findPersonalDocByUserUID: async ({ offset, limit, sortBy, order, userUID }) => {
            try {
                const sortableColumns = ["created_at", "updated_at"];

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
                    .Documents
                    .findAll({
                        where: {
                            user_uid: userUID,
                            deleted: false
                        },
                        order: [
                            [sortBy, order]
                        ]
                    });

                let medicalRecords = [];
                for (let i = 0; i < result?.length; i++) {
                    // temp
                    if (result &&
                        result[i]?.dataValues?.url &&
                        result[i]?.dataValues?.url?.split('/')[4] == 'documents') {
                        medicalRecords.push(result[i]?.dataValues)
                    }
                }

                const countDocuments = medicalRecords.length;

                if (limit) {
                    limit = parseInt(limit);
                } else {
                    limit = countDocuments;
                }
                const data = medicalRecords.slice(offset, offset + limit);
                return {
                    msg: `Find all documents result`,
                    data: {
                        documents: data,
                        offset,
                        limit,
                        sortBy,
                        sortableColumns: sortableColumns,
                        total: countDocuments,
                        order
                    }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find all documents: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        /*
     * @params {uid}uid - uid of the document
     * @returns {number} delete count
     */
        deleteByUID: async ({ documentUID }) => {
            try {
                const status = await models
                    .Documents
                    .destroy({
                        where: {
                            uid: documentUID,
                        }
                    });
                return {
                    msg: `Deleted Document`,
                    data: { deleted: status }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to delete document: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
    })
}

function load(fields) {
    // param map
    const paramsMap = {
        user_uid: 'user_uid',
        url: 'url',
        name: 'name',
        deleted: 'deleted',
        deleted_on: 'deleted_on',
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
        url: params.url,
        name: params.name,
        deleted: params.deleted,
        deleted_on: params.deleted_on,
        created_at: params.created_at,
        updated_at: params.updated_at,
    };
    return data;
}


function bulkLoad(fields) {

    let updateParams = [];

    for (const param of fields) {
        updateParams.push({
            user_uid: param.user_uid,
            url: param.url,
            name: param.name,
        })
    }

    return { updateParams }
}