const connection = require("./connection");
const db = connection.db;

exports.models = {
  User: db.User,
  Role: db.Role,
  NotificationDevice: db.Notification_device,
  DoctorDetails: db.Doctor_detail,
  PracticeDetails: db.Practice_detail,
  TreatmentCategories: db.Treatment_categories,
  Treatments: db.Treatments,
  Specializations: db.Specializations,
  Consultations: db.Consultations,
  ConsultationDoctors: db.Consultation_doctors,
  Documents: db.Document,
  CallLogs: db.Call_logs,
  Insurance: db.Insurance,
  MedicalRates: db.Medical_rate,
  Ipaddress: db.Ipaddress,
  TempUser: db.TempUser,
  Invitation: db.Invitation,
  AppPlans: db.App_plans,
  Subscriptions: db.Subscriptions,
  PaymentMethods: db.Payment_Methods,
  docGenerator: db.docGenerator
};
