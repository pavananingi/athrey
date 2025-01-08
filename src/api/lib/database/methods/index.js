const fromUser = require("./user");
const fromRole = require("./role");
const fromNotification = require("./notification-device");
const fromDoctor = require("./doctor");
const fromPractice = require("./practice");
const fromBank = require("./bank");
const fromTreatmentCategories = require("./treatment-categories");
const fromTreatments = require("./treatments");
const fromSpecializations = require("./specialization");
const fromConsultations = require("./consultations");
const fromConsultationsDoctors = require("./consultation-doctors");
const fromDocuments = require("./documents");
const fromCallLogs = require("./call-logs");
const fromAppPlans = require("./app-plans");
const fromInsurance = require("./insurance");
const fromMedicalRates = require("./medical-rates");
const fromIpaddress = require("./ipaddress");
const fromTempUser = require("./tempUser");
const fromAdmin = require("./admin");
const fromSubscription = require("./subscription");
const fromPaymentMethods = require("./payment-methods");
const fromDocGenerator = require("./doc-generator");

exports.methods = {
  User: fromUser.User,
  Role: fromRole.Role,
  NotificationDevice: fromNotification.NotificationDevice,
  DoctorDetails: fromDoctor.DoctorDetails,
  PracticeDetails: fromPractice.PracticeDetails,
  BankDetails: fromBank.BankDetails,
  TreatmentCategories: fromTreatmentCategories,
  Treatments: fromTreatments,
  Specializations: fromSpecializations,
  Consultations: fromConsultations,
  ConsultationDoctors: fromConsultationsDoctors,
  Documents: fromDocuments,
  CallLogs: fromCallLogs,
  Insurance: fromInsurance,
  MedicalRates: fromMedicalRates,
  Ipaddress: fromIpaddress,
  TempUser: fromTempUser,
  Admin: fromAdmin,
  AppPlans: fromAppPlans,
  Subscriptions: fromSubscription,
  PaymentMethods: fromPaymentMethods,
  docGenerator: fromDocGenerator,
};
