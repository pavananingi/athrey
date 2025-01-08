const fromAdmin = require('./admin');
const fromDoctor = require('./doctor');
const fromPatient = require('./patient');
const fromSuperadmin = require('./superadmin');

module.exports.grants = {
    admin: fromAdmin.admin,
    doctor: fromDoctor.doctor,
    patient: fromPatient.patient,
    superadmin: fromSuperadmin.superadmin,
}