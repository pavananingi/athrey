const fromAuth = require("./auth.controller");
const fromProfile = require("./profile.controller");
const fromDevices = require("./devices.controller");
const fromCommon = require("./common.controller");
const fromDoctor = require("./doctor.controller");
const fromTreatments = require("./treatments.controller");
const fromConsultations = require("./consultations.controller");
const fromCallLogs = require("./call-logs.controller");
const fromInsurance = require("./insurance.controller");
const fromToken = require("./token.controller");
const fromDocuments = require("./documents.controller");
const fromMedicalRates = require("./medical-rate.controller");
const fromTempUser = require("./tempUser.controller");
const fromAppPlans = require("./app_plans.controller");
const fromPayment = require("./payment.controller");
const fromAdmin = require("./admin.controller");

const controllers = {
  auth: { ...fromAuth },
  profile: { ...fromProfile },
  devices: { ...fromDevices },
  private: { ...fromCommon },
  doctor: { ...fromDoctor },
  treatments: { ...fromTreatments },
  consultations: { ...fromConsultations },
  callLogs: { ...fromCallLogs },
  appPlans: { ...fromAppPlans },
  payment: { ...fromPayment },
  common: { ...fromCommon },
  insurance: { ...fromInsurance },
  token: { ...fromToken },
  documents: { ...fromDocuments },
  medicalRates: { ...fromMedicalRates },
  tempUser: { ...fromTempUser },
  admin: { ...fromAdmin },
};

module.exports = controllers;
