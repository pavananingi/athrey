const fromEntities = require('../../entity');

exports.AcceptAdminInvite = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  crypto,
  request,
  db,
  mailer,
}) => {
  return Object.freeze({
    execute: async () => {
      try {
        const lang = request.locals.lang;
        const urlParams = request.urlParams
        const userUID = urlParams.userID

        let entity = fromEntities.entities.Admin.AdminEntity.AcceptAdminInvite({
          CreateError,
          DataValidator,
          logger,
          translate,
          lang,
          crypto,
          params: { 
            userUID,
            ...request.body,
          },
        }).generate().data.entity;

        const invitationsTable = db.methods.Admin({
          translate,
          logger,
          CreateError,
          lang
        });

        const findInvite = await invitationsTable.findAdminInviteByUserID({
          userID: entity.userUID,
          includeAll: false,
        });

        if(findInvite.data.admins === null){
          const findAdmin = await invitationsTable.findAdminByUserUID({
            userUID: entity.userUID,
            includeAll: false,
          }).data.admin;

          if (findAdmin.data.admins === null){
            throw new CreateError(translate(lang, 'admin_not_invited'));
          } else {
            throw new CreateError(translate(lang, 'invite_already_accepted'));
          }
        }

        const hashedPassword = (await crypto.PasswordHash({
          CreateError, translate, logger,
          password: entity.password
        }).hashPassword()).data.hashedPassword;
        
        entity.password = hashedPassword;

        const acceptInvite = await invitationsTable.acceptAdminInvite({
          uid: entity.userUID,
          password: entity.password,
          ...findInvite.data.admins
        });

        const acceptedInvite = acceptInvite.data.admins;

        return {
          msg: translate(lang, 'success'),
          data: { acceptedInvite }
        }
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error("Fail to accept admin invite: %s", error);
        throw new Error(error.message);
      }
    },
  });
}