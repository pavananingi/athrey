const AccessControl = require('accesscontrol');
const ac = new AccessControl();

// grants
const fromGrants = require('./grants').grants;

ac.deny('admin').createOwn('video');

ac.setGrants({
    superadmin: fromGrants.superadmin,
    admin: fromGrants.admin,
    doctor: fromGrants.doctor,
    patient: fromGrants.patient
});

module.exports = ac;

