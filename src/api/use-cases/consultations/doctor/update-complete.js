'use strict';
const consServices = require('../services');

module.exports = ({
    CreateError,
    logger,
    translate,
    request,
    db,
    ac,
    mailer,
    payment
}) => {
    return Object.freeze({
        execute: async () => {
            try {

                const lang = request.lang;
                const userUID = request.locals.uid;
                const role = request.locals.role;
                const urlParams = request.urlParams;
                const consultationUID = request.urlParams.uid;
                const doctorUID = request.urlParams.doctorUID;
                const body = request.body;


                if (!consultationUID) {
                    throw new CreateError(translate(lang, 'invalid_consultation_uid'))
                }

                if (!doctorUID) {
                    throw new CreateError(translate(lang, 'invalid_doctor_uid'))
                }

                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }

                let permission = ac.can(role).updateOwn('consultationDoctor');

                if (urlParams.doctorUID) {
                    if (urlParams.doctorUID !== userUID) {
                        permission = ac.can(role).updateAny('consultationDoctor');
                    }
                }

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).updateAny('consultationDoctor');
                }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }


                const consultationDoctorTable = db.methods.ConsultationDoctors({ translate, logger, CreateError, lang });
                const reportDetails = (await consultationDoctorTable.findDoctorByConsultationUID({ doctorUID: doctorUID, consultationUID })).data.doctors;

                // if (!reportDetails.invoice_id) {
                //     throw new CreateError(translate(lang, 'invoice_not_generated'))
                // }

                // generate documents
                consServices.diagnosis({ translate, logger, CreateError, lang, db, consultationUID: consultationUID, doctorUID: doctorUID })

                // 
                const usersTable = db.methods.User({ CreateError, logger, lang, translate });

                const consultationsTable = db.methods.Consultations({ translate, logger, CreateError, lang });

                consultationsTable.findByUID({ consultationUID: consultationUID })
                    .then(result => {
                        return usersTable.findByUID({ uid: result.data.consultations.patient_uid, includeAll: false })
                    }).then(result => {
                        const user = result.data.users
                        if (user) {
                            mailer.methods.Send({ CreateError, translate, logger, lang })
                                .consultationCompletedToPatient({
                                    to: user.email,
                                    salute: user.salute,
                                    title: user.title,
                                    firstname: user.firstname,
                                    lastname: user.lastname,
                                })
                        }
                    })

                // const invoiceMethods = payment.methods.Invoice({ CreateError, logger, lang, translate });
                // const invoiceSendStatus = invoiceMethods.sendInvoice({ invoiceId: reportDetails.invoice_id })

                const updateStatus = await consultationDoctorTable.updateByDoctorConsUID({
                    consultationUID: consultationUID,
                    doctorUID: doctorUID,
                    params: {
                        status: 'completed'
                    }
                });

                const updatedDetails = (await consultationDoctorTable.findAllByConsUID({ consultationUID })).data.doctors;

                return {
                    msg: translate(lang, 'updated_success'),
                    data: { doctors: updatedDetails }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to update consultation doctor details as completed: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}