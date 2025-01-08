const fromAuthRoutes = require("./auth.routes");
const fromProfileRoutes = require("./profile.routes");
const fromDevicesRoutes = require("./devices.routes");
const fromDoctorRoutes = require("./doctor.routes");
const fromTreatments = require("./treatment.routes");
const fromConsultations = require("./consultations.routes");
const fromCommon = require("./common.routes");
const fromInsurances = require("./insurance.routes");
const fromLogs = require("./logs.routes");
const fromToken = require("./token.routes");
const fromDocument = require("./document.routes");
const fromMedicalRatesRoutes = require("./medical-rates.routes");
const fromTempUserRoutes = require("./tempUser.routes");
const fromAdminRoutes = require("./admin.routes");
const fromAppPlans = require("./appPlans.routes");
const fromPayment = require("./payment.routes");

const routes = {
  auth: fromAuthRoutes,
  profile: fromProfileRoutes,
  devices: fromDevicesRoutes,
  doctor: fromDoctorRoutes,
  treatments: fromTreatments,
  consultations: fromConsultations,
  common: fromCommon,
  insurance: fromInsurances,
  logs: fromLogs,
  token: fromToken,
  documents: fromDocument,
  medicalRates: fromMedicalRatesRoutes,
  tempUser: fromTempUserRoutes,
  admin: fromAdminRoutes,
  appPlans: fromAppPlans,
  payment: fromPayment
};

module.exports = routes;
