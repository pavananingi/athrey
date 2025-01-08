const fromEntities = require('../../entity');

exports.CheckAdminInvite = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  request,
  db
}) => {
  return Object.freeze({
    execute: async () => {
      try{
        const lang = request.locals.lang;
        const urlParams = request.urlParams
        const userID = urlParams.userID

        let entity = fromEntities.entities.Admin.AdminEntity.CheckAdminInvite({
          CreateError,
          DataValidator,
          logger,
          translate,
          lang,
          params: { userID },
        }).generate().data.entity;

        const invitationsTable = db.methods.Admin({
          translate,
          logger,
          CreateError,
          lang
        });

        const findInvite = await invitationsTable.findAdminInviteByUserID({
          userID: entity.userID,
          includeAll: false,
        });

        if(findInvite.data.admins === null){
          const findAdmin = await invitationsTable.findAdminByUserUID({
            userUID: entity.userID,
            includeAll: false,
          }).data.admin;

          if (findAdmin.data.admins === null){
            throw new CreateError(translate(lang, 'admin_not_invited'));
          } else {
            throw new CreateError(translate(lang, 'invite_already_accepted'));
          }
        }

        const invite = findInvite.data.admins;

        return {
          msg: translate(lang, 'success'),
          data: { invite }
        }
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error("Failed to invite: %s", error);
        throw new Error(error.message);
      }
    },
  });
}