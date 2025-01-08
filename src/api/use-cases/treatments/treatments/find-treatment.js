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
                const queryParams = request.queryParams;
                const treatmentId = request.urlParams.treatmentId;

                let permission = ac.can(role).readAny('treatment');

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const treatmentsTable = await db.methods.Treatments({
                    translate, logger, CreateError, lang
                });

                if (!treatmentId) {
                    const result = (await treatmentsTable
                        .findAll({
                            offset: queryParams.offset,
                            limit: queryParams.limit,
                            sortBy: queryParams.sort_by,
                            order: queryParams.order
                        })).data;

                    return {
                        msg: translate(lang, 'success'),
                        data: {
                            treatments: result.treatments,
                            offset: result.offset,
                            limit: result.limit,
                            sort_by: result.sortBy,
                            order: result.order,
                            sortable_columns: result.sortableColumns,
                            total: result.total
                        }
                    }
                } else {
                    let result = (await treatmentsTable
                        .findByID(treatmentId))
                        .data.treatments;

                    if (result === null) {
                        throw new CreateError(translate(lang, 'treatment_not_found'), 404)
                    }

                    return {
                        msg: translate(lang, 'success'),
                        data: { treatments: result }
                    }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to find treatments: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}