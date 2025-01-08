const fromCreateConsultation = require("./create-consultation");
const fromCancelConsultation = require("./cancel-consultation");
const fromRescheduleConsultation = require("./reschedule-consultation");
const fromUpdateConsultation = require("./update-consultation");
const fromAssignDoctor = require("./doctor/assign-doctor");
const fromGetScheduledConsultations = require("./find-scheduled-consultations");
const fromGetOpenConsultations = require("./find-open-consultations");
const fromGetCompletedConsultations = require("./find-completed-consultations");
const fromGetConsultations = require("./find-consultation");
const fromGetCancelledConsultations = require("./find-cancelled-consultations");
const fromGetScheduledConsultationsCount = require("./doctor/count-scheduled-consultations");
const fromDoctorConsultations = require("./get-doctor-consultations");
const fromCreateCallLog = require("./call-logs/create-log");
const fromUpdateCallLog = require("./call-logs/update-log");
const fromGetCallLogs = require("./call-logs/get-log");
const fromGetDoctorCallLogs = require("./call-logs/get-doctor-log");
const fromGetReviewConsultations = require("./find-review-consultations");
const fromUpdateDoctorConsultations = require("./doctor/update-details");
const fromGetConsultationsList = require("./find-all-consultations");
const fromCreateDoctorConsultationInvoiceId = require("./doctor/create-invoice-id.js");
const fromMarkConsultationCompleted = require("./doctor/update-complete");
const fromUpdateConsultationCharge = require("./doctor/update-charge");
const fromCreateTempUserConsultation = require("./create-temp-consultation");
const fromAssignDoctorToTempPatient = require("./doctor/assign-doctor-to-temp-user");
module.exports = {
  CreateConsultation: fromCreateConsultation,
  CreateTempUserConsultation: fromCreateTempUserConsultation,
  UpdateConsultation: fromUpdateConsultation,
  CancelConsultation: fromCancelConsultation,
  RescheduleConsultation: fromRescheduleConsultation,
  GetScheduledConsultations: fromGetScheduledConsultations,
  GetOpenConsultations: fromGetOpenConsultations,
  GetReviewConsultations: fromGetReviewConsultations,
  GetCompletedConsultations: fromGetCompletedConsultations,
  GetConsultations: fromGetConsultations,
  GetCancelledConsultations: fromGetCancelledConsultations,
  GetScheduledConsultationsCount: fromGetScheduledConsultationsCount,
  GetConsultationsList: fromGetConsultationsList,
  Doctor: {
    AssignDoctor: fromAssignDoctor,
    GetDoctorConsultations: fromDoctorConsultations,
    UpdateConsultationDoctorReport: fromUpdateDoctorConsultations,
    CreateConsultationDoctorInvoiceId: fromCreateDoctorConsultationInvoiceId,
    MarkConsultationDoctorCompleted: fromMarkConsultationCompleted,
    UpdateConsultationCharge: fromUpdateConsultationCharge,
    AssignDoctorToTempPatient: fromAssignDoctorToTempPatient,
  },
  CallLogs: {
    CreateCallLog: fromCreateCallLog,
    UpdateCallLog: fromUpdateCallLog,
    GetCallLogs: fromGetCallLogs,
    GetDoctorCallLogs: fromGetDoctorCallLogs,
  },
};
