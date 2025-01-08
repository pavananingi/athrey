const fromEntities = require("../../entity");
const bruteForce =
  require("../../services/brute-force-attack-prevention.service").bruteForce;

const checkBlocked =
  require("../../services/brute-force-attack-prevention.service").checkBlocked;

exports.PasswordReset = ({
  CreateError,
  logger,
  translate,
  request,
  store,
  DataValidator,
  db,
  crypto,
  mailer,
  ipaddress,
}) => {
  return Object.freeze({
    execute: async () => {
      await checkBlocked({
        CreateError,
        lang: request.lang,
        ipaddress,
        translate,
        logger,
        db,
      });
      const excuteBruteForce = async () => {
        await bruteForce({
          CreateError,
          lang: request.lang,
          ipaddress,
          translate,
          logger,
          db,
        });
      };
      try {
        switch (request.urlParams.action) {
          case "findAccount":
            return await findAccount({
              CreateError,
              translate,
              request,
              db,
              DataValidator,
              store,
              logger,
              mailer,
              excuteBruteForce,
              ipaddress,
            });
          case "verifyOTP":
            return await verifyOTP({
              CreateError,
              translate,
              request,
              db,
              DataValidator,
              store,
              logger,
            });
          case "updatePassword":
            return await updatePassword({
              CreateError,
              translate,
              request,
              db,
              DataValidator,
              store,
              crypto,
              logger,
            });
          case "forceReset":
            return await forceReset({
              CreateError,
              translate,
              request,
              db,
              DataValidator,
              crypto,
              logger,
            });
          default:
            throw new CreateError(
              translate(request.lang, "method_not_implemented")
            );
        }
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error("Failed to reset user password", error);
        throw new Error(error.message);
      }
    },
  });
};

const findAccount = async ({
  CreateError,
  translate,
  request,
  db,
  store,
  DataValidator,
  logger,
  mailer,
  excuteBruteForce,
}) => {
  try {
    const lang = request.lang;
    let entity = await fromEntities.entities.Auth.PasswordResetEmailEntity({
      CreateError,
      DataValidator,
      logger,
      lang,
      translate,
      excuteBruteForce,
      params: { ...request.body },
    }).generate();

    entity = entity.data.entity;

    const user = (
      await db.methods
        .User({ CreateError, logger, lang, translate })
        .findByEmail({ email: entity.email, includeAll: false })
    ).data.users;

    if (user === null) {
      // throw new CreateError(`${translate(lang, 'password_reset_account_found')}: ${entity.email}`, 404)
      return {
        msg: translate(lang, "password_reset_account_found"),
        data: {},
      };
    }

    // generate and store OTP
    // const otp = parseInt(("" + Math.random()).substring(2, 8));
    const otp = getOTP(10);
    const storeOtpStatus = await store
      .Store({ translate, logger, lang, CreateError })
      .storeResetOtp({ otp, email: user.email });

    // send mail with otp
    mailer.methods.Send({ CreateError, translate, logger, lang }).otp({
      to: user.email,
      otp: otp,
      salute: user.salute,
      title: user.title,
      firstname: user.firstname,
      lastname: user.lastname,
    });

    return {
      msg: translate(lang, "password_reset_account_found"),
      data: {},
    };
  } catch (error) {
    if (error instanceof CreateError) {
      throw error;
    }
    logger.error("password-reset failed to find account", error);
    throw new Error(error.message);
  }
};

const verifyOTP = async ({
  CreateError,
  translate,
  request,
  DataValidator,
  store,
  logger,
}) => {
  try {
    const lang = request.lang;
    const entity = fromEntities.entities.Auth.PasswordResetVerifyOTP({
      CreateError,
      DataValidator,
      logger,
      lang,
      translate,
      params: { ...request.body },
    }).generate().data.entity;

    const latestOTP = (
      await store
        .Store({ translate, logger, lang, CreateError })
        .getResetOtp({ email: entity.email })
    ).data.otp;

    if (latestOTP === null) {
      throw new CreateError(translate(lang, "otp_expired"), 404);
    }

    if (String(entity.otp) !== String(latestOTP)) {
      throw new CreateError(translate(lang, "invalid_otp"), 401);
    }

    return {
      msg: translate(lang, "success_otp_verified"),
      data: {},
    };
  } catch (error) {
    if (error instanceof CreateError) {
      throw error;
    }
    logger.error("password-reset failed to find verify OTP", error);
    throw new Error(error.message);
  }
};

const updatePassword = async ({
  CreateError,
  translate,
  request,
  db,
  DataValidator,
  store,
  crypto,
  logger,
}) => {
  try {
    const lang = request.lang;

    const entity = fromEntities.entities.Auth.PasswordReset({
      CreateError,
      DataValidator,
      logger,
      translate,
      crypto,
      lang,
      params: request.body,
    }).generate().data.entity;

    const storeObj = store.Store({ translate, logger, lang, CreateError });
    //
    const latestOTP = (await storeObj.getResetOtp({ email: entity.email })).data
      .otp;

    if (latestOTP === null) {
      throw new CreateError(translate(lang, "otp_expired"), 404);
    }

    if (String(entity.otp) !== String(latestOTP)) {
      throw new CreateError(translate(lang, "invalid_otp"), 401);
    }

    // encrypt password
    const hashedPassword = (
      await crypto
        .PasswordHash({
          CreateError,
          translate,
          logger,
          password: entity.password,
        })
        .hashPassword()
    ).data.hashedPassword;

    entity.password = hashedPassword;

    const usersTable = db.methods.User({
      translate,
      logger,
      CreateError,
      lang,
    });
    const updatePassword = await usersTable.updatePasswordByEmail({
      email: entity.email,
      password: entity.password,
    });

    //  delete OTP
    storeObj.deleteResetOtp({ email: entity.email });

    // reset invald attempts
    usersTable.updateByEmail({
      email: entity.email,
      params: { invalid_attempts: 0 },
    });

    return {
      msg: translate(lang, "success_password_updated"),
      data: {},
    };
  } catch (error) {
    if (error instanceof CreateError) {
      throw error;
    }
    logger.error("Failed to update user password", error);
    throw new Error(error.message);
  }
};

const forceReset = async ({
  CreateError,
  translate,
  request,
  db,
  DataValidator,
  crypto,
  logger,
}) => {
  try {
    const lang = request.lang;

    const entity = fromEntities.entities.Auth.PasswordResetOldPassword({
      CreateError,
      DataValidator,
      logger,
      translate,
      crypto,
      lang,
      params: request.body,
    }).generate().data.entity;

    const usersTable = db.methods.User({
      translate,
      logger,
      CreateError,
      lang,
    });

    // find user
    const user = (
      await usersTable.findByEmail({ email: entity.email, includeAll: true })
    ).data.users;

    if (user === null) {
      throw new CreateError(translate(lang, "account_not_found"), 404);
    }

    const passwordHash = crypto.PasswordHash({
      CreateError,
      translate,
      logger,
      password: entity.old_password,
    });

    const verifyPassword = (await passwordHash.validatePassword(user.password))
      .data.valid;

    // invalid password
    if (!verifyPassword) {
      usersTable.updateByEmail({
        email: user.email,
        params: {
          invalid_attempts: user.invalid_attempts + 1,
        },
      });
      throw new CreateError(translate(lang, "invalid_old_password"), 401);
    }

    // encrypt password
    const hashedPassword = (
      await crypto
        .PasswordHash({
          CreateError,
          translate,
          logger,
          password: entity.password,
        })
        .hashPassword()
    ).data.hashedPassword;

    entity.password = hashedPassword;

    const updatePassword = await usersTable.updatePasswordByEmail({
      email: entity.email,
      password: entity.password,
    });

    // reset invald attempts & first_login
    const removeFlags = await usersTable.updateByEmail({
      email: entity.email,
      params: {
        invalid_attempts: 0,
        force_reset_password: false,
      },
    });

    return {
      msg: translate(lang, "success_password_updated"),
      data: {},
    };
  } catch (error) {
    if (error instanceof CreateError) {
      throw error;
    }
    logger.error("Failed to reset password using old password", error);
    throw new Error(error.message);
  }
};

function getOTP(len, charSet) {
  len = 10 || len;
  charSet =
    charSet ||
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%*";
  var randomString = "";
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
}
