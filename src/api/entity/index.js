const fromAuth = require("./auth");
const fromProfile = require("./profile");
const fromDevice = require("./device");
const fromDoctor = require("./doctor");
const fromTreatments = require("./treatment");
const fromConsultations = require("./consultation");
const fromDocuments = require("./documents");
const fromCallLog = require("./call-log");
const fromAppPlans = require("./appPlans");
const fromInsurance = require("./insurance");
const fromMedicalRate = require("./medical-rates");
const fromTempUser = require("./tempUser");
const fromAdmin = require("./admin");

exports.entities = {
  AppPlans: { ...fromAppPlans },
  Auth: { ...fromAuth.AuthEntity },
  Profile: { ...fromProfile.ProfileEntity },
  Device: { ...fromDevice.DeviceEntity },
  Doctor: { ...fromDoctor },
  Treatment: { ...fromTreatments },
  Consultation: { ...fromConsultations },
  Documents: { ...fromDocuments },
  CallLog: { ...fromCallLog },
  Insurance: { ...fromInsurance },
  MedicalRates: { ...fromMedicalRate },
  TempUser: { ...fromTempUser.TempUserEntity },
  Admin: { ...fromAdmin }
};
