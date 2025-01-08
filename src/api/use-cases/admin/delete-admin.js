const fromEntities = require('../../entity');

exports.DeleteAdmin = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  request,
  db,
  ac,
}) => {
  return Object.freeze({
    execute: async () => {
      try {
        const lang = request.locals.lang;
        const role = request.locals.role;
        const urlParams = request.urlParams;
        const userUID = urlParams.userUID;

        let permission = ac.can(role).deleteAny('admin');

        if (role === 'superadmin') {
          permission = ac.can(role).deleteAny('admin');
        }

        if (!permission.granted) {
          throw new CreateError(translate(lang, 'forbidden'), 403);
        }

        let entity = fromEntities.entities.Admin.AdminEntity.DeleteAdmin({
          CreateError,
          DataValidator,
          logger,
          translate,
          lang,
          params: { userUID },
        }).generate().data.entity;

        const adminsTable = db.methods.Admin({
          translate,
          logger,
          CreateError,
          lang
        });

        const findAdmin = await adminsTable.findAdminByUserUID({
          userUID: entity.userUID,
          includeAll: false,
        });

        if (findAdmin.data.admins === null) {
          throw new CreateError(translate(lang, 'admin_not_found'));
        }

        const deleteAdmin = await adminsTable.deleteAdminByUserUID({
          userUID: entity.userUID,
          includeAll: false,
        });

        const deletedAdmin = deleteAdmin.data.admins;

        return {
          msg: translate(lang, 'success'),
          data: { deletedAdmin }
        }
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error("Failed to delete admin: %s", error);
        throw new Error(error.message);
      }
    }
  });
}