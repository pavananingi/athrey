const fromEntities = require('../../entity');
const url = require('../../../config/app.config.json').originUrl[process.env.NODE_ENV].https;

exports.InviteAdmin = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  crypto,
  request,
  db,
  mailer,
  ac,
}) => {
  return Object.freeze({
    execute: async () => {
      try {
        const lang = request.locals.lang;
        const role = request.locals.role;
        const userUID = request.locals.uid;

        if (userUID === undefined) {
          throw new CreateError(translate(lang, 'invalid_details'));
        }

        let permission = ac.can(role).createAny('admin');

        if (role === 'admin' || role === 'superadmin') {
          permission = ac.can(role).createAny('admin');
        }

        if (!permission.granted) {
          throw new CreateError(translate(lang, 'forbidden'), 403);
        }

        let entity = fromEntities.entities.Admin.AdminEntity.InviteAdmin({
          CreateError,
          DataValidator,
          logger,
          translate,
          crypto,
          lang,
          params: { ...request.body },
        }).generate().data.entity;

        const invitationsTable = db.methods.Admin({
          translate,
          logger,
          CreateError,
          lang,
        })

        const findUser = (
          await invitationsTable.findAdminInviteByEmail({
            email: entity.email,
            includeAll: false,
          })
        ).data.admins

        if (findUser !== null) {
          throw new CreateError(translate(lang, 'email_exists'))
        }

        const inviteAdmin = (await invitationsTable.inviteAdmin({ ...entity })).data
          .InvitedAdmin;

        // mailer.methods.Send({ CreateError, translate, logger, lang })
        //   .adminInvite({
        //     to: inviteAdmin.email,
        //     salute: inviteAdmin.salute,
        //     title: " ",
        //     firstname: inviteAdmin.firstname,
        //     lastname: inviteAdmin.lastname,
        //     invite_link: `${url}/api/en/v1/admins/accept/${inviteAdmin.uid}`,
        //   })

        return {
          msg: translate(lang, 'success_signup'),
          data: { inviteAdmin }
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