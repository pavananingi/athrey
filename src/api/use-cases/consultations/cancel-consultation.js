'use strict';
const fromEntity = require('../../entity');
const fromNotificationService = require('../../services').Services;

module.exports = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    request,
    db,
    ac,
    notifications,
    mailer
}) => {
    return Object.freeze({
        execute: async () => {
            try {

                const lang = request.lang;
                const userUID = request.locals.uid;
                const role = request.locals.role;
                const urlParams = request.urlParams;
                const consultationUID = request.urlParams.uid;
                const validate = DataValidator({ CreateError, lang, translate });

                if (!consultationUID) {
                    throw new CreateError(translate(lang, 'invalid_consultation_uid'))
                } else {
                    validate.uuid(consultationUID).data.value;
                }

                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                } else {
                    validate.uuid(userUID).data.value;
                }

                let permission = ac.can(role).updateOwn('consultation');

                if (urlParams.userUID) {
                    if (urlParams.userUID !== userUID) {
                        permission = ac.can(role).updateAny('consultation');
                    }
                }

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).updateAny('consultation');
                }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const consultationsTable = db.methods.Consultations({ translate, logger, CreateError, lang });

                // check whether status is open
                const consultationDetails = (await consultationsTable.findByUID({ consultationUID: consultationUID })).data.consultations;
                if (!consultationDetails) {
                    throw new CreateError(translate(lang, 'consultation_not_found'), 404);
                }

                if (role === 'patient' && (consultationDetails.status !== 'open' || consultationDetails.patient_uid !== userUID)) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                } else if (role === 'doctor' && (consultationDetails.status !== 'scheduled' || consultationDetails?.doctor[0]?.doctor_uid !== userUID)) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                // change consultation status to cancelled
                const updateStatus = (await consultationsTable.updateStatusByUID({ consultationUID, status: 'cancelled' }));

                if (role === 'doctor') {
                    const doctorUID = userUID;
                    const consultationDoctorsTable = db.methods.ConsultationDoctors({ translate, logger, CreateError, lang });

                    // assign consultation doctor
                    const assignDoctor = (await consultationDoctorsTable
                        .updateStatusByUID({ consultationUID, doctorUID, status: 'cancelled' }));

                    // fromNotificationService.ConsultationNotification({
                    //     translate, logger, CreateError, lang, notifications, db
                    // }).cancelled({
                    //     consultationUID
                    // });

                    // send email
                    db.methods.User({ CreateError, logger, lang, translate })
                        .findByUID({ uid: consultationDetails.patient_uid, includeAll: false })
                        .then(result => {
                            const user = result.data.users
                            if (user) {
                                mailer.methods.Send({ CreateError, translate, logger, lang })
                                    .consultationCancelledToPatient({
                                        to: user.email,
                                        salute: user.salute,
                                        title: user.title,
                                        firstname: user.firstname,
                                        lastname: user.lastname
                                    })
                            }
                        });
                }

                return {
                    msg: translate(lang, 'cancelled_consultation'),
                    data: {}
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to update consultation: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}