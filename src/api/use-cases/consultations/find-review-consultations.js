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

                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }

                const consultationsTable = db.methods.Consultations({ translate, logger, CreateError, lang });

                switch (role) {
                    case 'doctor':
                        const doctorReview = (await consultationsTable
                            .findAllReviewByDoctorUID({ doctorUID: userUID })).data.consultations;

                        return {
                            msg: translate(lang, 'success'),
                            data: {
                                consultations: {
                                    review: doctorReview
                                }
                            }
                        }
                    case 'patient':
                        const patientReview = (await consultationsTable
                            .findAllReviewByPatientUID({ patientUID: userUID })).data.consultations;

                        return {
                            msg: translate(lang, 'success'),
                            data: {
                                consultations: {
                                    review: patientReview
                                }
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
                logger.error(`Failed to find review consultations: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}