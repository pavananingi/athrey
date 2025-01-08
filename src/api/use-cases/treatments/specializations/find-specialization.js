const fromEntites = require('../../../entity');

module.exports = ({
    CreateError,
    logger,
    translate,
    request,
    db,
    ac,
}) => {
    return Object.freeze({
        execute: async () => {
            try {
                const lang = request.lang;
                const role = request.locals.role;
                const urlParams = request.urlParams;
                const queryParams = request.queryParams;


                let permission = ac.can(role).readAny('treatmentCategories');

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const specializationTable = await db.methods.Specializations({
                    translate, logger, CreateError, lang
                });

                if (!urlParams.uid) {
                    const result = (await specializationTable
                        .findAll({
                            offset: queryParams.offset,
                            limit: queryParams.limit,
                            sortBy: queryParams.sort_by,
                            order: queryParams.order
                        })).data;

                    return {
                        msg: translate(lang, 'success'),
                        data: {
                            specializations: result.specializations,
                            offset: result.offset,
                            limit: result.limit,
                            sort_by: result.sortBy,
                            order: result.order,
                            sortable_columns: result.sortableColumns,
                            total: result.total
                        }
                    }
                } else {
                    let result = (await specializationTable
                        .findByUID(urlParams.uid))
                        .data.specializations;

                    if (result === null) {
                        throw new CreateError(translate(lang, 'specialization_not_found'), 404)
                    } 

                    return {
                        msg: translate(lang, 'success'),
                        data: { specializations: result }
                    }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to find specializations: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}