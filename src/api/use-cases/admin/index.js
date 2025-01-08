const fromFindUsers = require('./find-users');
const fromFindAdmins = require('./find-admins');
const fromInviteAdmin = require('./invite-admin');
const fromUpdateDoctorStatus = require('./update-status-doctor');
const fromCreateAdmin = require('./create-admin');
const fromAcceptAdminInvite = require('./accept-admin-invite');
const fromCheckAdminInvite = require('./check-admin-invite');
const fromDeleteAdmin = require('./delete-admin');

module.exports = {
    FindAdmins: fromFindAdmins.FindAdmins,
    FindUsers: fromFindUsers.FindUsers,
    InviteAdmin: fromInviteAdmin.InviteAdmin,
    CreateAdmin: fromCreateAdmin.CreateAdmin,
    UpdateDoctorStatus: fromUpdateDoctorStatus.UpdateDoctorStatus,
    CheckAdminInvite: fromCheckAdminInvite.CheckAdminInvite,
    AcceptAdminInvite: fromAcceptAdminInvite.AcceptAdminInvite,
    DeleteAdmin: fromDeleteAdmin.DeleteAdmin,
}
