const models = require("../models").models;

module.exports = ({ translate, logger, CreateError, lang }) => {
  return Object.freeze({
    create: async (params) => {
      try {
        const constructedParams = load(params);
        const create = await models.TempUser.create(
          constructedParams.updateParams
        );
        return {
          msg: `Created Temp User successfully`,
          data: { TempUser: unload(create.dataValues) },
        };
      } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
          throw new CreateError(translate(lang, "duplicate_cocument"), 409);
        }
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error("Failed to create ipaddress: %s %s", error.message, error);
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },
    findByEmail: async ({ email }) => {
      try {
        const find = await models.TempUser.findOne({
          where: {
            email: email,
          },
        });
        return {
          msg: `Found insurance successfully`,
          data: { TempUser: find ? unload(find) : find },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error("Failed to find TempUser: %s %s", error.message, error);
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },
    findByUID: async ({ uid }) => {
      try {
        const findUser = await models.TempUser.findOne({
          where: { uid },
        });

        return {
          msg: `Find user result`,
          data: {
            TempUser: findUser === null ? null : unload(findUser),
          },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          "Failed to find users by uid: %s %s",
          error.message,
          error
        );
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },
    //     updateByAddress: async ({ ipaddress, params }) => {
    //       try {
    //         const constructedParams = load(params);

    //         const update = await models.TempUser.update(
    //           constructedParams.updateParams,
    //           {
    //             where: {
    //               address: ipaddress,
    //             },
    //           }
    //         );
    //         return {
    //           msg: `Updated ipaddress successfully`,
    //           data: { update },
    //         };
    //       } catch (error) {
    //         if (error instanceof CreateError) {
    //           throw error;
    //         }
    //         logger.error(
    //           "Failed to update ipaddress details: %s %s",
    //           error.message,
    //           error
    //         );
    //         throw Error(translate(lang, "unknown_error_contact_support"));
    //       }
    //     },
    deleteByEmail: async ({ email }) => {
      try {
        const status = await models.TempUser.destroy({
          where: {
            email: email,
          },
        });
        return {
          msg: `Deleted Temp User`,
          data: { deleted: status },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error("Failed to delete temp user: %s %s", error.message, error);
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },
  });
};

function load(fields) {
  // param map
  const paramsMap = {
    uid: "uid",
    firstname: "firstname",
    lastname: "lastname",
    email: "email",
    consent: "consent",
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
    uid: params.uid,
    firstname: params.firstname,
    lastname: params.lastname,
    email: params.email,
    consent: params.consent,
  };
  return data;
}
