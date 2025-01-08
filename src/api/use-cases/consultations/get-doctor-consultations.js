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
                const userUID = request.locals.uid;
                const role = request.locals.role;
                const urlParams = request.urlParams;
                const queryParams = request.queryParams;
                const date = request.urlParams.date;

                if (!date) {
                    throw new CreateError(translate(lang, 'required_consultation_date'))
                }

                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }

                const consultationsTable = db.methods.Consultations({ translate, logger, CreateError, lang });

                switch (role) {
                    case 'doctor':
                        const result = (await consultationsTable
                            .findAllDateByDoctorUID({
                                doctorUID: userUID,
                                date: date,
                                offset: queryParams.offset,
                                limit: queryParams.limit,
                                sortBy: queryParams.sort_by,
                                order: queryParams.order
                            })).data;

                        return {
                            msg: translate(lang, 'success'),
                            data: {
                                consultations: result.consultations,
                                offset: result.offset,
                                limit: result.limit,
                                sort_by: result.sortBy,
                                order: result.order,
                                sortable_columns: result.sortableColumns,
                                total: result.total
                            }
                        }
                        break;
                    case 'patient':

                        break;
                    case 'admin':

                        break;
                    case 'superadmin':

                        break;

                    default:
                        break;
                }

                return {
                    msg: translate(lang, 'success'),
                    data: { consultations: {} }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to find consultations: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}