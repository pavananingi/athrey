const fromCreateConsultation = require('./create-consultation.entity');
const fromUpdateConsultation = require('./update-consultation.entity');
const fromAssignDoctor = require('./assign-doctor.entity');
const fromUpdateConsultationDoctor = require('./update-consultation-doctor.entity');
const fromRescheduleConsultation = require('./reschedule-doctor.entity');
const fromCreateInvoice = require('./create-invoice.entity');
const fromDoctorConsultationCharge = require('./update-consultation-charge.entity');

module.exports = {
    CreateConsultation: fromCreateConsultation,
    UpdateConsultation: fromUpdateConsultation,
    RescheduleConsultation: fromRescheduleConsultation,
    Doctor: {
        AssignConsultation: fromAssignDoctor,
        UpdateConsultation: fromUpdateConsultationDoctor,
        CreateInvoice: fromCreateInvoice,
    },
    UpdateConsultationCharge: fromDoctorConsultationCharge
}