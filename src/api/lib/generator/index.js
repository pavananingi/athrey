'use strict';
const fromDiagnosis = require('./diagnosis');
const fromLeaveletter = require('./leave-letter');
const fromPrescription = require('./prescription');
const fromMedicalCharge = require('./medical-rates');
const fromInvoices = require('./invoices');

module.exports = {
    diagnosis: fromDiagnosis,
    leaveLetter: fromLeaveletter,
    prescription: fromPrescription,
    medicalRates: fromMedicalCharge,
    invoices: fromInvoices
}