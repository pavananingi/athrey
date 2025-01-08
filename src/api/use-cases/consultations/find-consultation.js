const env = process.env.NODE_ENV || 'development';
const Minio = require('minio');

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
                const consultationUID = request.urlParams.uid;

                if (!consultationUID) {
                    throw new CreateError(translate(lang, 'required_consultation_uid'))
                }

                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }

                const consultationsTable = db.methods.Consultations({ translate, logger, CreateError, lang });

                switch (role) {
                    case 'doctor':
                        let consultationDetailsDoctor = (await consultationsTable
                            .findByUID({ consultationUID: consultationUID })).data.consultations;

                        if (consultationDetailsDoctor === null) {
                            throw new CreateError(translate(lang, 'consultation_not_found'));
                        }

                        if (consultationDetailsDoctor.status !== 'open') {
                            // whether the consultation is scheduled to this doctor or different validation
                            if (consultationDetailsDoctor.doctor[0].doctor_uid !== userUID) {
                                throw new CreateError(translate(lang, 'consultation_forbidden'), 403);
                            }
                            let doc_uids = [];
                            if (consultationDetailsDoctor?.documents_uid?.length) {
                                doc_uids = [...consultationDetailsDoctor?.documents_uid];
                            }
                            if (consultationDetailsDoctor?.doctor[0]?.medical_charges_doc_uid) {
                                doc_uids.push(consultationDetailsDoctor.doctor[0].medical_charges_doc_uid)
                            }
                            if (consultationDetailsDoctor?.doctor[0]?.prescription_doc_uid) {
                                doc_uids.push(consultationDetailsDoctor.doctor[0].prescription_doc_uid)
                            }
                            if (consultationDetailsDoctor?.doctor[0]?.diagnosis_doc_uid) {
                                doc_uids.push(consultationDetailsDoctor.doctor[0].diagnosis_doc_uid)
                            }
                            if (consultationDetailsDoctor?.doctor[0]?.invoices_doc_uid) {
                                doc_uids.push(consultationDetailsDoctor.doctor[0].invoices_doc_uid)
                            }
                            if (consultationDetailsDoctor?.doctor[0]?.leave_letter_doc_uid?.length) {
                                doc_uids = [...doc_uids, ...consultationDetailsDoctor.doctor[0].leave_letter_doc_uid]
                            }

                            // add the documents list
                            const documents = (await db.methods.Documents({ translate, logger, CreateError, lang })
                                .findAllbyUID({ uid: doc_uids })).data.documents;

                            // add the documents list
                            const insurance = (await db.methods.Insurance({ translate, logger, CreateError, lang })
                                .findByUserUID({ userUID: consultationDetailsDoctor.patient_uid })).data.insurances;

                            consultationDetailsDoctor.documents = documents;
                            consultationDetailsDoctor.insurance = insurance;
                        }

                        for (let i = 0; i < consultationDetailsDoctor?.patient_summary?.length; i++) {
                            let answer = consultationDetailsDoctor?.patient_summary[i]?.answer;
                            if (answer && typeof answer == "string") {
                                const yTrue = answer.toLowerCase() == "yes" || answer.toLowerCase() == 'Jawohl'.toLowerCase()
                                const nTrue = answer.toLowerCase() == "no" || answer.toLowerCase() == 'Nein'.toLowerCase()

                                if (yTrue) {
                                    answer = lang == 'en' ? "Yes" : 'Jawohl';
                                    consultationDetailsDoctor.patient_summary[i].answer = answer
                                } else if (nTrue) {
                                    answer = lang == 'en' ? "No" : 'Nein';
                                    consultationDetailsDoctor.patient_summary[i].answer = answer
                                }
                            } else if (answer && typeof answer == "object") {
                                for (let j = 0; j < answer?.length; j++) {
                                    const yTrue = answer[j].toLowerCase() == "yes" || answer[j].toLowerCase() == 'Jawohl'.toLowerCase()
                                    const nTrue = answer[j].toLowerCase() == "no" || answer[j].toLowerCase() == 'Nein'.toLowerCase()
                                    if (yTrue) {
                                        answer = lang == 'en' ? "Yes" : 'Jawohl';
                                        consultationDetailsDoctor.patient_summary[i].answer[j] = answer
                                    } else if (nTrue) {
                                        answer = lang == 'en' ? "No" : 'Nein';
                                        consultationDetailsDoctor.patient_summary[i].answer[j] = answer
                                    }
                                }
                            }
                        }
                        return {
                            msg: translate(lang, 'success'),
                            data: {
                                consultations: consultationDetailsDoctor,
                            }
                        }
                    case 'patient':
                        const consultationDetailsPatient = (await consultationsTable
                            .findByUIDPatientUID({ consultationUID: consultationUID, patientUID: userUID })).data.consultations;

                        let documents = []
                        for (let uid of consultationDetailsPatient?.documents_uid || []) {
                            let result = (await db.methods.Documents({ translate, logger, CreateError, lang })
                                .findByUID({ documentUID: uid }))?.data?.documents;

                            if (!result) continue;

                            const minioClient = new Minio.Client({
                                endPoint: 's3.amazonaws.com',
                                port: 443,
                                useSSL: true,
                                accessKey: process.env.S3_ACCESS_KEY,
                                secretKey: process.env.S3_SECRET_ACCESS_KEY,
                            });

                            documents.push(await minioClient.presignedUrl(
                                'GET',
                                process.env.S3_BUCKET_NAME,
                                result.url,
                                24 * 60 * 60 * 7
                            ));
                        }
                        consultationDetailsPatient.documents = documents;

                        if (consultationDetailsPatient === null) {
                            throw new CreateError(translate(lang, 'consultation_not_found'));
                        }
                        for (let i = 0; i < consultationDetailsPatient?.patient_summary?.length; i++) {
                            let answer = consultationDetailsPatient?.patient_summary[i]?.answer;

                            if (answer && typeof answer == "string") {
                                const yTrue = answer.toLowerCase() == "yes" || answer.toLowerCase() == 'Jawohl'.toLowerCase()
                                const nTrue = answer.toLowerCase() == "no" || answer.toLowerCase() == 'Nein'.toLowerCase()
                                if (yTrue) {
                                    answer = lang == 'en' ? "Yes" : 'Jawohl';
                                    consultationDetailsPatient.patient_summary[i].answer = answer
                                } else if (nTrue) {
                                    answer = lang == 'en' ? "No" : 'Nein';
                                    consultationDetailsPatient.patient_summary[i].answer = answer
                                }
                            } else if (answer && typeof answer == "object") {
                                for (let j = 0; j < answer?.length; j++) {
                                    const yTrue = answer[j].toLowerCase() == "yes" || answer[j].toLowerCase() == 'Jawohl'.toLowerCase()
                                    const nTrue = answer[j].toLowerCase() == "no" || answer[j].toLowerCase() == 'Nein'.toLowerCase()
                                    if (yTrue) {
                                        answer = lang == 'en' ? "Yes" : 'Jawohl';
                                        consultationDetailsPatient.patient_summary[i].answer[j] = answer
                                    } else if (nTrue) {
                                        answer = lang == 'en' ? "No" : 'Nein';
                                        consultationDetailsPatient.patient_summary[i].answer[j] = answer
                                    }
                                }
                            }
                        }
                        return {
                            msg: translate(lang, 'success'),
                            data: {
                                consultations: consultationDetailsPatient
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