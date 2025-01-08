const models = require("../models").models;

module.exports = ({ translate, logger, CreateError, lang }) => {
  return Object.freeze({
    create: async (params) => {
      try {
        const constructedParams = load(params);
        const create = await models.Ipaddress.create(
          constructedParams.updateParams
        );
        return {
          msg: `Created Ipaddress successfully`,
          data: { ipaddresses: unload(create.dataValues) },
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
    findByAddress: async ({ ipaddress }) => {
      try {
        const find = await models.Ipaddress.findOne({
          where: {
            address: ipaddress,
          },
        });
        return {
          msg: `Found insurance successfully`,
          data: { ipaddresses: find ? unload(find) : find },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error("Failed to find Ipaddress: %s %s", error.message, error);
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },
    updateByAddress: async ({ ipaddress, params }) => {
      try {
        const constructedParams = load(params);

        const update = await models.Ipaddress.update(
          constructedParams.updateParams,
          {
            where: {
              address: ipaddress,
            },
          }
        );
        return {
          msg: `Updated ipaddress successfully`,
          data: { update },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          "Failed to update ipaddress details: %s %s",
          error.message,
          error
        );
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },
    deleteByAddress: async ({ address }) => {
      try {
        const status = await models.Ipaddress.destroy({
          where: {
            address: address,
          },
        });
        return {
          msg: `Deleted ipaddress`,
          data: { deleted: status },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error("Failed to delete insurance: %s %s", error.message, error);
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },
  });
};

function load(fields) {
  // param map
  const paramsMap = {
    address: "address",
    invalidtry: "invalidtry",
    validtry_time: "validtry_time",
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
    address: params.address,
    invalidtry: params.invalidtry,
    validtry_time: params.validtry_time,
  };
  return data;
}
