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

                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }

                let permission = ac.can(role).readOwn('consultation');

                if (urlParams.userUID) {
                    if (urlParams.userUID !== userUID) {
                        permission = ac.can(role).readAny('consultation');
                    }
                }

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).readAny('consultation');
                }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const consultationsTable = db.methods.Consultations({ translate, logger, CreateError, lang });

                switch (role) {
                    case 'doctor':
                        const doctorCons = (await consultationsTable
                            .findAllByDoctorUID({
                                doctorUID: userUID,
                                offset: queryParams.offset,
                                limit: queryParams.limit,
                                sortBy: queryParams.sort_by,
                                order: queryParams.order
                            })).data;

                        return {
                            msg: translate(lang, 'success'),
                            data: {
                                consultations: doctorCons.consultations,
                                offset: doctorCons.offset,
                                limit: doctorCons.limit,
                                sort_by: doctorCons.sortBy,
                                order: doctorCons.order,
                                sortable_columns: doctorCons.sortableColumns,
                                total: doctorCons.total
                            }
                        }
                    case 'patient':
                        const patientCons = (await consultationsTable
                            .findAllByPatientUID({
                                patientUID: userUID,
                                offset: queryParams.offset,
                                limit: queryParams.limit,
                                sortBy: queryParams.sort_by,
                                order: queryParams.order
                            })).data;

                        return {
                            msg: translate(lang, 'success'),
                            data: {
                                consultations: patientCons.consultations,
                                offset: patientCons.offset,
                                limit: patientCons.limit,
                                sort_by: patientCons.sortBy,
                                order: patientCons.order,
                                sortable_columns: patientCons.sortableColumns,
                                total: patientCons.total
                            }
                        }
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