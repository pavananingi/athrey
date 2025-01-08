const models = require("../models").models;
const { Op } = require("sequelize");

module.exports = ({ translate, logger, CreateError, lang }) => {
  const requiredAttributes = ["uid", "salute", "title", "firstname", "lastname", "avatar_url", "email", "country_code", "phone"];
  return Object.freeze({
    findAllAdmins: async ({ offset, limit, sortBy, order }) => {
      try {
        const sortableColumns = ["created_at", "updated_at"];
        
        if(limit){
          limit = parseInt(limit);
        } else {
          limit = 100;
        }

        if(offset){
          offset = parseInt(offset);
        } else {
          offset = 0;
        }

        if(sortBy){
          sortBy = sortBy;
        } else {
          sortBy = 'created_at';
        }

        if(order){
          order = order.toUpperCase();
        } else {
          order = 'DESC';
        }

        const findAdmin = await models
          .User
          .findAll({
            offset: offset,
            limit: limit,
            order: [
              [sortBy, order]
            ],
            attributes: requiredAttributes,
            include: [{
              model: models.Role,
              as: 'roles',
              attributes: ['superadmin', 'admin', 'doctor', 'patient', 'staff'],
              where: {
                [Op.or]: [
                  {
                    superadmin: true
                  },
                  {
                    admin: true
                  }
                ]
              }
            }],
          });

        const countAdmins = await models
          .User
          .count({
            include: [{
              model: models.Role,
              as: 'roles',
              where: {
                [Op.or]: [
                  {
                    superadmin: true
                  },
                  {
                    admin: true
                  }
                ]
              }
            }]
          });
          return {
            msg: `Find all admins result`,
            data: {
                admins: findAdmin,
                offset,
                limit,
                sortBy,
                sortableColumns: sortableColumns,
                total: countAdmins,
                order
            }
        }
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Failed to find all admins: %s %s', error.message, error);
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    findAdminByUserUID: async ({ userUID }) => {
      try {
        const findAdmin = await models
          .User
          .findOne({
            where: {
              uid: userUID
            },
            include: [{
              model: models.Role,
              as: 'roles',
              where: {
                user_uid: userUID,
                [Op.or]: [
                  {
                    superadmin: true
                  },
                  {
                    admin: true
                  }
                ]
              }
            }]
          });

        return {
          msg: `Find admin result`,
          data: { admins: findAdmin === null ? null : unload(findAdmin.dataValues) }
        }
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Failed to find admin: %s %s', error.message, error);
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    findAdminInviteByEmail: async ({ email }) => {
      try {
        const findAdmin = await models
          .Invitation
          .findOne({
            where: {
              email: email
            }
          });

        return {
          msg: `Find admin result`,
          data: { admins: findAdmin === null ? null : unload(findAdmin.dataValues) }
        }
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Failed to find admin: %s %s', error.message, error);
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    findAdminInviteByUserID: async ({ userID }) => {
      try {
        const findAdmin = await models
          .Invitation
          .findOne({
            where: {
              uid: userID
            }
          });

        return {
          msg: `Find admin result`,
          data: { admins: findAdmin === null ? null : unload(findAdmin.dataValues) }
        }
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Failed to find admin: %s %s', error.message, error);
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    inviteAdmin: async (params) => {
      try {
        const constructedParams = load(params);
        const create = await models.Invitation.create(constructedParams.updateParams);
        return {
          msg: `Invited admin successfully`,
          data: { InvitedAdmin: unload(create.dataValues) }
        };
      } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
          throw new CreateError(translate(lang, "duplicate_cocument"), 409);
        }
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error("Failed to invite admin: %s %s", error.message, error);
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },

    acceptAdminInvite: async (params) => {
      try {
        const constructedParams = inviteLoad(params);
        const create = await models.User.create({
          is_active: true,
          ...constructedParams.updateParams
        });
        const invite = await models.Invitation.destroy({
          where: {
            uid: constructedParams.updateParams.uid
          }
        });
        const role = await models.Role.create({
          user_uid: create.uid,
          admin: constructedParams.updateParams.role === 'admin' ? true : false,
          doctor: constructedParams.updateParams.role === 'doctor' ? true : false,
          patient: constructedParams.updateParams.role === 'patient' ? true : false,
          staff: constructedParams.updateParams.role === 'staff' ? true : false,
          superadmin: constructedParams.updateParams.role === 'superadmin' ? true : false
        });
        return {
          msg: `Admin invite accepted successfully`,
          data: { admins: unload(create, { includeAll: false }) }
      }
      } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
          throw new CreateError(translate(lang, "duplicate_cocument"), 409);
        }
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error("Failed to accept invite: %s %s", error.message, error);
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },
    deleteAdminByUserUID: async ({ userUID }) => {
      try {
        const findAdmin = await models
          .User
          .findOne({
            where: {
              uid: userUID
            },
            include: [{
              model: models.Role,
              as: 'roles',
              where: {
                user_uid: userUID,
                [Op.or]: [
                  {
                    superadmin: true
                  },
                  {
                    admin: true
                  }
                ]
              }
            }]
          });
        if (findAdmin === null) {
          throw new CreateError(translate(lang, "admin_not_found"), 404);
        }
        
        const deleteRole = await models
          .Role
          .destroy({
            where: {
              user_uid: userUID
            }
          });
          
        const deleteAdmin = await models
          .User
          .destroy({
            where: {
              uid: userUID
            }
          });
          

        return {
          msg: `Admin deleted successfully`,
          data: { admins: unload(findAdmin.dataValues) }
        }
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error("Failed to accept invite: %s %s", error.message, error);
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },
  });
}

function load(fields) {
  // param map
  const paramsMap = {
    user_uid: "user_uid",
    salute: "salute",
    firstname: "firstname",
    lastname: "lastname",
    email: "email",
    role: "role",
  };

  let updateParams = {};

  for (const param in fields) {
    const key = paramsMap[param];
    updateParams[key] = fields[param];
  }

  return { updateParams };
}

function inviteLoad(fields) {
  const paramsMap = {
    uid: "uid",
    salute: "salute",
    firstname: "firstname",
    lastname: "lastname",
    email: "email",
    role: "role",
    password: "password",
  };

  let updateParams = {};

  for (const param in fields) {
    const key = paramsMap[param];
    updateParams[key] = fields[param];
  }

  return { updateParams };
}

function unload(params) {
  const data = {
      user_uid: params.uid,
      salute: params.salute,
      title: params.title,
      firstname: params.firstname,
      lastname: params.lastname,
      avatar_url: params.avatar_url,
      email: params.email,
      country_code: params.country_code,
      phone: params.phone,
      role: params.role,
  };
  return data;
}