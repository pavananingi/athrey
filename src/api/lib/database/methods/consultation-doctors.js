const models = require('../models').models;
const dbCon = require('../connection').db;

module.exports = ({ translate, logger, CreateError, lang }) => {

    const documentAttributes = [
        ['uid', 'uid'],
        ['user_uid', 'user_uid'],
        ['url', 'url'],
        ['name', 'name'],
        ['created_at', 'created_at'],
        ['updated_at', 'updated_at'],
    ]

    return Object.freeze({
        create: async (params) => {
            try {
                const constructedParams = load(params);
                const create = await models
                    .ConsultationDoctors
                    .findOrCreate({
                        where: {
                            consultation_uid: constructedParams.updateParams.consultation_uid,
                            doctor_uid: constructedParams.updateParams.doctor_uid
                        },
                        defaults: constructedParams.updateParams
                    });
                if (!create[1]) {
                    throw new CreateError(translate(lang, 'already_assigned'), 409)
                }
                return {
                    msg: `Assigned doctor to consultation successfully`,
                    data: { doctors: unload(create[0]) }
                }
            } catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    throw new CreateError(translate(lang, 'duplicate_consultation_assigned'), 409)
                } if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to assign doctor to consultation: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        countByDate: async ({ year, month, day }) => {
            try {
                if (year) {
                    if (year < 2021) {
                        throw new CreateError(translate(lang, 'invalid_year'))
                    }
                } else {
                    throw new CreateError(translate(lang, 'required_year'))
                }
                let monthFilter = ``;
                if (month) {
                    monthFilter = `AND
                    EXTRACT(MONTH FROM confirmed_schedule)='${month}'`
                }
                let dayFilter = ``;
                if (day) {
                    dayFilter = `AND
                    EXTRACT(DAY FROM confirmed_schedule)='${day}'`
                }
                const count = await dbCon.sequelize
                    .query(`SELECT 
                                CAST(confirmed_schedule AS DATE) as date, 
                                COUNT(confirmed_schedule) as count
                            FROM "Consultation_doctors"
                            WHERE 
                                EXTRACT(YEAR FROM confirmed_schedule)='${year}'
                                ${monthFilter}
                                ${dayFilter}
                            GROUP BY date`);
                return {
                    msg: `count consultation result`,
                    data: { consultations: count[0] }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to count consultations: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        updateByDoctorConsUID: async ({ consultationUID, doctorUID, params }) => {
            try {
                const constructedParams = load(params);
                const update = await models
                    .ConsultationDoctors
                    .update(constructedParams.updateParams,
                        {
                            where: {
                                consultation_uid: consultationUID,
                                doctor_uid: doctorUID
                            }
                        });
                return {
                    msg: `Updated consultation doctor details successfully`,
                    data: {}
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to update consultation doctor details: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        updateStatusByUID: async ({ consultationUID, doctorUID, status }) => {
            try {
                const update = await models
                    .ConsultationDoctors
                    .update({
                        status: status
                    },
                        {
                            where: {
                                consultation_uid: consultationUID,
                                doctor_uid: doctorUID
                            }
                        });
                return {
                    msg: `Updated consultation details successfully`,
                    data: {}
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to update consultation details: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        findAllByConsUID: async ({ consultationUID }) => {
            try {
                const find = await models
                    .ConsultationDoctors
                    .findAll(
                        {
                            include: [
                                {
                                    model: models.Documents,
                                    as: 'diagnosis_document',
                                    required: false,
                                    attributes: documentAttributes,
                                }
                            ],

                            where: {
                                consultation_uid: consultationUID,
                            }
                        });
                return {
                    msg: `Ok`,
                    data: { doctors: find }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find consultation doctor details: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        findDoctorByConsultationUID: async ({ doctorUID, consultationUID }) => {
            try {
                const find = await models
                    .ConsultationDoctors
                    .findOne(
                        {
                            include: [
                                {
                                    model: models.Documents,
                                    as: 'diagnosis_document',
                                    required: false,
                                    attributes: documentAttributes,
                                }
                            ],
                            where: {
                                consultation_uid: consultationUID,
                                doctor_uid: doctorUID
                            }
                        });
                return {
                    msg: `Ok`,
                    data: { doctors: find }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find consultation doctor details: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
    })
}


function unload(params) {
    const data = {
        id: params.id,
        consultation_uid: params.consultation_uid,
        doctor_uid: params.doctor_uid,
        confirmed_schedule: params.confirmed_schedule,
        duration: params.duration,
        notes: params.notes,
        status: params.status,
        leave_letter: params.leave_letter,
        prescription: params.prescription,
        diagnosis: params.diagnosis,
        rating: params.rating,
        review: params.review,
        diagnosis_doc_uid: params.diagnosis_doc_uid,
        leave_letter_doc_uid: params.leave_letter_doc_uid,
        prescription_doc_uid: params.prescription_doc_uid,
        invoice_id: params.invoice_id,
        invoice_status: params.invoice_status,
        manual_invoice: params.manual_invoice,
        medical_charges: params.medical_charges,
        medical_charges_doc_uid: params.medical_charges_doc_uid,
        invoices_doc_uid: params.invoices_doc_uid,
        // comments: params.comments,
        created_at: params.created_at,
        updated_at: params.updated_at,
    };
    return data;
}

function load(fields) {
    // param map
    const paramsMap = {
        consultation_uid: 'consultation_uid',
        doctor_uid: 'doctor_uid',
        confirmed_schedule: 'confirmed_schedule',
        duration: 'duration',
        notes: 'notes',
        status: 'status',
        leave_letter: 'leave_letter',
        prescription: 'prescription',
        diagnosis: 'diagnosis',
        rating: 'rating',
        review: 'review',
        diagnosis_doc_uid: 'diagnosis_doc_uid',
        leave_letter_doc_uid: 'leave_letter_doc_uid',
        prescription_doc_uid: 'prescription_doc_uid',
        invoice_id: 'invoice_id',
        invoice_status: 'invoice_status',
        manual_invoice: 'manual_invoice',
        medical_charges: 'medical_charges',
        medical_charges_doc_uid: 'medical_charges_doc_uid',
        invoices_doc_uid: 'invoices_doc_uid',
        // comments: 'comments',
    };

    let updateParams = {};

    for (const param in fields) {
        const key = paramsMap[param];
        updateParams[key] = fields[param];
    }

    return { updateParams }
}
