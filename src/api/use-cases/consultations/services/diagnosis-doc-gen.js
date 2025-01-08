'use strict';
const queues = require('../../../lib/queues');
const generator = require('../../../lib/generator');

module.exports = async ({ translate, logger, CreateError, lang, consultationUID, doctorUID, db }) => {
    try {
        const filename = "Diagnose.pdf";
        const usersTable = db.methods.User({ translate, logger, CreateError, lang });
        const practiceTable = db.methods.PracticeDetails({ translate, logger, CreateError, lang });
        const consultationsTable = db.methods.Consultations({ translate, logger, CreateError, lang });
        // const docGeneratorTable = db.methods.docGenerator({ translate, logger, CreateError, lang });
        const consultationDoctors = db.methods.ConsultationDoctors({ translate, logger, CreateError, lang });

        const consultation = (await consultationsTable.findByUID({ consultationUID })).data.consultations;
        if (!consultation) {
            logger.info('Consultation not found to generate documents: %s', consultationUID);
            return
        }

        const consultationReport = (await consultationDoctors.findDoctorByConsultationUID({ doctorUID, consultationUID })).data.doctors;
        if (!consultationReport) {
            logger.info('Consultation report not available: %s', consultationUID);
            return;
        }

        const patient = (await usersTable.findByUID({ uid: consultation.patient_uid, includeAll: false })).data.users;
        const doctor = (await usersTable.findByUID({ uid: doctorUID, includeAll: false })).data.users;

        const patientDetails = {
            uid: patient.uid,
            salute: patient.salute,
            title: patient.title,
            firstname: patient.firstname,
            lastname: patient.lastname,
            address_line_1: patient.address_line_1,
            address_line_2: patient.address_line_2,
            city: patient.city,
            state: patient.state,
            country: patient.country,
            postal_code: patient.postal_code,
            country_code: patient.country_code,
            phone: patient.phone,
            dob: patient.dob
        }
        const doctorDetails = {
            uid: doctor.uid,
            salute: doctor.salute,
            title: doctor.title,
            firstname: doctor.firstname,
            lastname: doctor.lastname,
            address_line_1: doctor.address_line_1,
            address_line_2: doctor.address_line_2,
            city: doctor.city,
            state: doctor.state,
            country: doctor.country,
            postal_code: doctor.postal_code,
            country_code: doctor.country_code,
            phone: doctor.phone,
        }

        const practice = (await practiceTable
            .findByUserUID({ userUID: doctorUID }))
            .data.practice;

        if (practice !== null) {
            doctorDetails.address_line_1 = practice.address_line_1;
            doctorDetails.address_line_2 = practice.address_line_2;
            doctorDetails.city = practice.city;
            doctorDetails.state = practice.state;
            doctorDetails.country = practice.country;
            doctorDetails.postal_code = practice.postal_code;
        }

        if (consultationReport.medical_charges) {
            let doc_path = `athrey/consultation-doc/${consultationUID}/medicalrates_${new Date().getTime()}.pdf`;
            await generator.medicalRates({
                consultation: {
                    patient: patientDetails,
                    doctor: doctorDetails,
                    uid: consultationUID,
                    medical_charges: consultationReport.medical_charges,
                },
                handler: {
                    status: true, uid: consultationUID,
                    objectKey: doc_path
                }
            }).then(handler => {
                if (handler.status) {
                    logger.info('Requested for consultation medical-charges generation', consultationUID);
                    return db.methods.Documents({ translate, logger, CreateError, lang })
                        .create({
                            user_uid: patient.uid,
                            url: doc_path,
                            name: 'medicalrates.pdf',
                        });
                } else {
                    logger.error('Failed to request medical charges generation');
                }
            }).then(data => {
                // update the UID to consultation table
                consultationDoctors.updateByDoctorConsUID({
                    consultationUID: consultationUID, doctorUID: doctorUID, params: {
                        medical_charges_doc_uid: data.data.documents.uid
                    }
                });
            }).catch(error => {
                logger.info('Failed to add medical charge request to Q: %s %s', error.message, error);
            })

            // docGeneratorTable
            //     .create({
            //         consultation: {
            //             patient: patientDetails,
            //             doctor: doctorDetails,
            //             uid: consultationUID,
            //             medical_charges: consultationReport.medical_charges,
            //             urls: [medicalChargeUrls.url]
            //         },
            //         type: 'medical-charges'
            //     })

        }

        if (consultationReport.prescription) {
            let doc_path = `athrey/consultation-doc/${consultationUID}/prescription_${new Date().getTime()}.pdf`;
            await generator.prescription({
                consultation: {
                    patient: patientDetails,
                    doctor: doctorDetails,
                    uid: consultationUID,
                    confirmed_schedule: consultationReport.confirmed_schedule,
                    prescription: consultationReport.prescription,
                },
                handler: { status: true, uid: consultationUID, objectKey: doc_path }
            }).then(handler => {
                if (handler.status) {

                    logger.info('Requested for consultation prescription generation', consultationUID);
                    return db.methods.Documents({ translate, logger, CreateError, lang })
                        .create({
                            user_uid: patient.uid,
                            url: doc_path,
                            name: 'prescription.pdf',
                        });
                } else {
                    logger.error('Failed to request prescription generation');
                }
            }).then(data => {
                // update the UID to consultation table
                consultationDoctors.updateByDoctorConsUID({
                    consultationUID: consultationUID, doctorUID: doctorUID, params: {
                        prescription_doc_uid: data.data.documents.uid
                    }
                });
            }).catch(error => {
                logger.info('Failed to add prescription request to Q: %s %s', error.message, error);
            })

            // docGeneratorTable
            //     .create({
            //         consultation: {
            //             patient: patientDetails,
            //             doctor: doctorDetails,
            //             uid: consultationUID,
            //             confirmed_schedule: consultationReport.confirmed_schedule,
            //             prescription: consultationReport.prescription,
            //             urls: [prescriptionUrls.url]
            //         },
            //         type: 'prescription'
            //     })

        }

        if (consultationReport.leave_letter) {
            let doc_path_1 = `consultation-doc/${consultationUID}/leaveletter1_${new Date().getTime()}.pdf`;
            let doc_path_2 = `consultation-doc/${consultationUID}/leaveletter2_${new Date().getTime()}.pdf`;
            let doc_path_3 = `consultation-doc/${consultationUID}/leaveletter3_${new Date().getTime()}.pdf`;
            let doc_path_4 = `athrey/consultation-doc/${consultationUID}/leaveletter4_${new Date().getTime()}.pdf`;
            await generator.leaveLetter({
                consultation: {
                    patient: patientDetails,
                    doctor: doctorDetails,
                    uid: consultationUID,
                    confirmed_schedule: consultationReport.confirmed_schedule,
                    leave_letter: consultationReport.leave_letter,
                },
                handler: {
                    status: true, uid: consultationUID,
                    objectKey: [
                        doc_path_1,
                        doc_path_2,
                        doc_path_3,
                        doc_path_4,
                    ]
                }
            })
                .then(handler => {
                    if (handler.status) {
                        logger.info('Requested for consultation leave letter documents generation', consultationUID);
                        return db.methods.Documents({ translate, logger, CreateError, lang })
                            .createBulk([
                                {
                                    url: doc_path_1,
                                    name: 'leaveletter1.pdf',
                                    user_uid: patient.uid
                                },
                                {
                                    url: doc_path_2,
                                    name: 'leaveletter2.pdf',
                                    user_uid: patient.uid
                                },
                                {
                                    url: doc_path_3,
                                    name: 'leaveletter3.pdf',
                                    user_uid: patient.uid
                                },
                                {
                                    url: doc_path_4,
                                    name: 'leaveletter4.pdf',
                                    user_uid: patient.uid
                                }
                            ]);
                    } else {
                        logger.error('Failed to request leave letter document generation');
                    }
                }).then(data => {
                    // update the UID to consultation table
                    const docRefs = data.data.documents.map(i => i.uid);
                    consultationDoctors.updateByDoctorConsUID({
                        consultationUID: consultationUID, doctorUID: doctorUID, params: {
                            leave_letter_doc_uid: docRefs
                        }
                    });
                }).catch(error => {
                    logger.info('Failed to add leave letter request to Q: %s %s', error.message, error);
                })

            // docGeneratorTable
            //     .create({
            //         consultation: {
            //             patient: patientDetails,
            //             doctor: doctorDetails,
            //             uid: consultationUID,
            //             confirmed_schedule: consultationReport.confirmed_schedule,
            //             leave_letter: consultationReport.leave_letter,
            //             urls: [leaveLetterUrl1.url, leaveLetterUrl2.url, leaveLetterUrl3.url, leaveLetterUrl4.url]
            //         },
            //         type: 'leave-letter'
            //     })

        }

        if (consultationReport.diagnosis) {
            let doc_path = `athrey/consultation-doc/${consultationUID}/diagnosis_${new Date().getTime()}.pdf`;
            // generate upload URL
            await generator.diagnosis(
                {
                    consultation: {
                        patient: patientDetails,
                        doctor: doctorDetails,
                        uid: consultationUID,
                        confirmed_schedule: consultationReport.confirmed_schedule,
                        diagnosis: consultationReport.diagnosis,
                    },
                    handler:
                        { status: true, uid: consultationUID, objectKey: doc_path }
                })
                .then(handler => {
                    if (handler.status) {
                        logger.info('Requested for consultation documents generation', consultationUID);
                        return db.methods.Documents({ translate, logger, CreateError, lang })
                            .create({
                                user_uid: patient.uid,
                                url: doc_path,
                                name: "diagnosis.pdf",
                            });
                    } else {
                        logger.error('Failed to request document generation');
                    }
                }).then(data => {
                    // update the UID to consultation table
                    consultationDoctors.updateByDoctorConsUID({
                        consultationUID: consultationUID, doctorUID: doctorUID, params: {
                            diagnosis_doc_uid: data.data.documents.uid
                        }
                    });
                }).catch(error => {
                    logger.info('Failed to add diganosis request to Q: %s %s', error.message, error);
                })
            // docGeneratorTable
            //     .create({
            //         consultation: {
            //             patient: patientDetails,
            //             doctor: doctorDetails,
            //             uid: consultationUID,
            //             confirmed_schedule: consultationReport.confirmed_schedule,
            //             diagnosis: consultationReport.diagnosis,
            //             urls: [diagnosisUrls.url]
            //         },
            //         type: 'diagnosis'
            //     })

        }

        if (consultationReport.manual_invoice) {
            // generate upload URL
            const bank_details = (await db.methods.BankDetails({ translate, logger, CreateError, lang })
                .findByUserUID({ userUID: doctorUID }))?.data?.doctors

            let doc_path = `athrey/consultation-doc/${consultationUID}/invoice_${new Date().getTime()}.pdf`;
            await generator.invoices({
                consultation: {
                    patient: patientDetails,
                    doctor: doctorDetails,
                    uid: consultationUID,
                    confirmed_schedule: consultationReport.confirmed_schedule,
                    manual_invoice: consultationReport.manual_invoice,
                    diagnosis: consultationReport.diagnosis.diagnosis || [],
                    bank_details: {
                        IBAN: bank_details?.account_iban,
                        BIC: bank_details?.account_bic
                    }
                },
                handler: { status: true, uid: consultationUID, objectKey: doc_path }
            }).then(handler => {
                if (handler.status) {
                    logger.info('Requested for consultation Invoice generation', consultationUID);
                    return db.methods.Documents({ translate, logger, CreateError, lang })
                        .create({
                            user_uid: patient.uid,
                            url: doc_path,
                            name: 'invoice.pdf',
                        });
                } else {
                    logger.error('Failed to request document generation');
                }
            }).then(data => {
                // update the UID to consultation table
                consultationDoctors.updateByDoctorConsUID({
                    consultationUID: consultationUID, doctorUID: doctorUID, params: {
                        invoices_doc_uid: data.data.documents.uid
                    }
                });
            }).catch(error => {
                logger.info('Failed to add Invoice request to Q: %s %s', error.message, error);
            })

            // docGeneratorTable
            //     .create({
            //         consultation: {
            //             patient: patientDetails,
            //             doctor: doctorDetails,
            //             uid: consultationUID,
            //             confirmed_schedule: consultationReport.confirmed_schedule,
            //             manual_invoice: consultationReport.manual_invoice,
            //             urls: [invoiceUrls.url],
            //             diagnosis: consultationReport.diagnosis.diagnosis || [],
            //             bank_details: {
            //                 IBAN: bank_details?.account_iban,
            //                 BIC: bank_details?.account_bic
            //             }
            //         },
            //         type: 'invoices'
            //     })

        }
    } catch (error) {
        logger.error('Failed to add diganosis request to Q: %s %s', error.message, error);
    }
}

// for queues
// queues.docGenerator()
//     .genConsDiagnosisDocs({
//         patient: patientDetails,
//         doctor: doctorDetails,
//         uid: consultationUID,
//         confirmed_schedule: consultationReport.confirmed_schedule,
//         diagnosis: consultationReport.diagnosis,
//         urls: [diagnosisUrls.url]
//     }).then(status => {
//         if (status) { }
//     })