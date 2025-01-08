const fromCreateAdminEntity = require("./create-admin.entity");
const fromInviteAdminEntity = require("./invite-admin.entity");
const fromAcceptAdminInviteEntity = require("./accept-admin-invite.entity");
const fromCheckAdminInviteEntity = require("./check-admin-invite.entity");
const fromDeleteAdminEntity = require("./delete-admin.entity");

exports.AdminEntity = {
  InviteAdmin: fromInviteAdminEntity.InviteAdminEntity,
  CreateAdmin: fromCreateAdminEntity.createAdminEntity,
  AcceptAdminInvite: fromAcceptAdminInviteEntity.AcceptAdminInviteEntity,
  CheckAdminInvite: fromCheckAdminInviteEntity.CheckAdminInviteEntity,
  DeleteAdmin: fromDeleteAdminEntity.DeleteAdminEntity,
};