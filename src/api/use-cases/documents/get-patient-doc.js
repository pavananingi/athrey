const fromEntity = require('../../entity');

/*
 * @desc List the documents urls in database based on user UID
 * @returns [object]urls - urls 
*/
module.exports = ({
    CreateError,
    logger,
    translate,
    request,
    db,
    ac
}) => {
    return Object.freeze({
        execute: async () => {
            try {
                const lang = request.lang;
                let userUID = request.locals.uid;
                const role = request.locals.role;
                const queryParams = request.queryParams;
                const urlParams = request.urlParams;

                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }

                if (role === 'doctor') {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                let permission = ac.can(role).readOwn('documents');

                if (urlParams.userUID) {
                    if (urlParams.userUID !== userUID) {
                        permission = ac.can(role).readAny('documents');
                        userUID = urlParams.userUID;
                    }
                }

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).readAny('documents');
                }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const result = (await db.methods.Documents({ translate, logger, CreateError, lang })
                    .findPersonalDocByUserUID({
                        offset: queryParams.offset,
                        limit: queryParams.limit,
                        sortBy: queryParams.sort_by,
                        order: queryParams.order,
                        userUID: userUID
                    })).data;

                return {
                    msg: translate(lang, 'success'),
                    data: {
                        documents: result.documents,
                        offset: result.offset,
                        limit: result.limit,
                        sort_by: result.sortBy,
                        order: result.order,
                        sortable_columns: result.sortableColumns,
                        total: result.total
                    }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to get documents: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}