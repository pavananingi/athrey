'use strict';
const fromEntity = require('../../../entity');
const fromPaymentServices = require('../../payment-services');

module.exports = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    request,
    db,
    ac,
    mailer,
    payment,
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
                const findConsDoctorReport = (await consultationDoctorTable.findDoctorByConsultationUID({ doctorUID: doctorUID, consultationUID })).data.doctors;

                if (!findConsDoctorReport) {
                    throw new CreateError(translate(lang, 'consultation_not_found'), 404)
                }

                if (findConsDoctorReport.status !== 'review') {
                    throw new CreateError(translate(lang, 'consultation_invoice_status_error'))
                }

                if (findConsDoctorReport.invoice_id) {
                    throw new CreateError(translate(lang, 'consultation_invoice_duplicate_try'))
                }



                const consultationsTable = db.methods.Consultations({ translate, logger, CreateError, lang });
                const consultationDetails = (await consultationsTable.findByUID({ consultationUID })).data.consultations;

                if (!consultationDetails) {
                    throw new CreateError(translate(lang, 'consultation_not_found'), 404)
                }

                const usersTable = db.methods.User({ translate, logger, CreateError, lang });
                let patientDetails = (await usersTable.findByUID({ uid: consultationDetails.patient_uid, includeAll: false })).data.users;

                // if (!patientDetails.customer_id) {
                //     // generate the new customer ID
                //     const createCustomer = (await fromPaymentServices.creatCustomer({
                //         CreateError,
                //         logger,
                //         translate,
                //         db,
                //         payment,
                //         user: patientDetails,
                //         lang: lang
                //     })).data.customer;

                //     patientDetails.customer_id = createCustomer.id
                // }

                const entity = (await fromEntity.entities
                    .Consultation
                    .Doctor
                    .CreateInvoice({
                        CreateError,
                        DataValidator,
                        logger,
                        translate,
                        lang,
                        params: {
                            ...body,
                        }
                    }).generate()).data.entity;

                const invoiceItemsMethods = payment.methods.InvoiceItems({ translate, logger, CreateError, lang });
                const invoiceItem = (await invoiceItemsMethods.create({
                    customerId: patientDetails.customer_id,
                    item: entity
                })).data.invoiceItem

                const invoiceMethods = payment.methods.Invoice({ translate, logger, CreateError, lang });
                const createInvoice = (await invoiceMethods.create({
                    customerId: patientDetails.customer_id,
                    consultation_uid: consultationUID,
                    doctor_uid: findConsDoctorReport.doctor_uid
                })).data.invoice;

                const updateStatus = await consultationDoctorTable.updateByDoctorConsUID({
                    consultationUID: consultationUID,
                    doctorUID: doctorUID,
                    params: {
                        invoice_id: createInvoice.id,
                        invoice_status: 'draft'
                    }
                });

                const updatedDetails = (await consultationDoctorTable.findAllByConsUID({ consultationUID })).data.doctors;

                return {
                    msg: translate(lang, 'created_invoice'),
                    data: { doctors: updatedDetails }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to create consultation doctor invoice: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}