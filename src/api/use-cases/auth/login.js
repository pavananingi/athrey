const fromEntities = require("../../entity");
const config = require("../../../config/app.config.json");
const e = require("express");
const env = process.env.NODE_ENV || 'development';
const Minio = require('minio');

const bruteForce =
  require("../../services/brute-force-attack-prevention.service").bruteForce;

const checkBlocked =
  require("../../services/brute-force-attack-prevention.service").checkBlocked;

exports.Login = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  crypto,
  store,
  db,
  request,
  token,
  ipaddress,
}) => {
  const loginTrials = config.loginTrials;
  return Object.freeze({
    execute: async () => {
      try {
        switch (request.method) {
          case "POST":
            return await postLogin({
              CreateError,
              DataValidator,
              logger,
              translate,
              crypto,
              store,
              db,
              request,
              loginTrials,
              token,
              ipaddress,
            });
          case "GET":
            return await getLogin({
              CreateError,
              DataValidator,
              logger,
              translate,
              crypto,
              store,
              db,
              request,
              token,
            });
          default:
            throw new CreateError(
              translate(request.lang, "method_not_implemented"),
              405
            );
        }
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(`Failed to login: %s`, error);
        throw new Error(error.message);
      }
    },
  });
};

async function postLogin({
  CreateError,
  DataValidator,
  logger,
  translate,
  crypto,
  store,
  db,
  request,
  loginTrials,
  token,
  ipaddress,
}) {
  try {
    // generate entity
    const lang = request.lang;
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
    let entity = await fromEntities.entities.Auth.Login({
      CreateError,
      DataValidator,
      logger,
      translate,
      crypto,
      lang,
      excuteBruteForce,
      params: {
        ...request.body,
      },
    }).generate();
    entity = entity.data.entity;

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
      await excuteBruteForce();
      throw new CreateError(translate(lang, "invalid_login_credentials"), 404);
    }

    if (parseInt(user.invalid_attempts) > parseInt(loginTrials)) {
      throw new CreateError(translate(lang, "maximum_password_retries"));
    }

    // check if the account is disabled
    if (!user.is_active) {
      throw new CreateError(translate(lang, "account_disabled"), 403);
    }

    // force reset password
    if (user.force_reset_password) {
      throw new CreateError(translate(lang, "error_reset_password"), 303);
    }

    const passwordHash = crypto.PasswordHash({
      CreateError,
      translate,
      logger,
      password: entity.password,
    });

    const verifyPassword = (await passwordHash.validatePassword(user.password))
      .data.valid;

    // invalid password
    if (!verifyPassword) {
      await excuteBruteForce();
      usersTable.updateByEmail({
        email: user.email,
        params: {
          invalid_attempts: user.invalid_attempts + 1,
        },
      });
      throw new CreateError(translate(lang, "invalid_login_credentials"), 401);
    }

    // reset the invalid attemptes
    if (user.invalid_attempts !== 0) {
      usersTable.updateByEmail({
        email: user.email,
        params: { invalid_attempts: 0 },
      });
    }

    delete user.password;

    if (user?.id_cirtificate_uid) {
      let result = (await db.methods.Documents({ translate, logger, CreateError, lang })
        .findByUID({ documentUID: user.id_cirtificate_uid })).data.documents;

      const minioClient = new Minio.Client({
        endPoint: 's3.amazonaws.com',
        port: 443,
        useSSL: true,
        accessKey: process.env.S3_ACCESS_KEY,
        secretKey: process.env.S3_SECRET_ACCESS_KEY,
      });
      user.cirtificate = await minioClient.presignedUrl(
        'GET',
        process.env.S3_BUCKET_NAME,
        result.url,
        24 * 60 * 60 * 7
      );
    }

    // assign roles
    let role;
    if (/[a-zA-Z:\/.]*(admin)[a-zA-Z:\/.]*/.test(request.locals.origin) || user?.roles?.admin) {
      role = user.roles.superadmin ? "superadmin" : "admin";
    } else {
      if (!user.roles.doctor && !user.roles.patient) {
        throw new CreateError(translate(lang, "error_account_role"), 400);
      }
      role = user.roles.doctor ? "doctor" : "patient";
    }

    // register the device used for the logging in
    let loginDevice = null;
    if (request.body.device) {
      const deviceEntity = fromEntities.entities.Device.RegisterDevice({
        CreateError,
        DataValidator,
        logger,
        translate,
        lang,
        params: {
          ...request.body.device,
          user_uid: user.uid,
        },
      }).generate().data.entity;

      const devicesTable = db.methods.NotificationDevice({
        translate,
        logger,
        CreateError,
        lang,
      });

      // create device
      loginDevice = (await devicesTable.create({ ...deviceEntity })).data
        .devices;
    }

    const tokenGenerator = token.jwt({ CreateError, translate, lang, logger });

    const bearerToken = (
      await tokenGenerator.generateBearerToken({
        uid: user.uid,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: role,
        ua: request.locals.ua,
      })
    ).data.token;

    const refreshToken = (
      await tokenGenerator.generateRefreshToken({
        uid: user.uid,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: role,
        ua: request.locals.ua,
      })
    ).data.token;

    const storeToken = await store
      .Store({ lang, CreateError, translate, logger })
      .storeRefreshToken({
        token: refreshToken,
        userUID: user.uid,
        ip: "",
        ua: request.locals.ua,
      });

    return {
      msg: translate(lang, "success"),
      data: {
        storeToken,
        user: user,
        token: bearerToken,
        refresh_token: refreshToken,
        devices: loginDevice,
      },
    };
  } catch (error) {
    if (error instanceof CreateError) {
      throw error;
    }
    logger.error("POST: Failed to login user", error);
    throw new Error(error.message);
  }
}

async function getLogin({ CreateError, logger, translate, db, request }) {
  try {
    const lang = request.lang;
    const userUID = request.locals.uid;

    if (userUID === undefined) {
      throw new CreateError(translate(lang, "invalid_details"));
    }

    const usersTable = db.methods.User({
      translate,
      logger,
      CreateError,
      lang,
    });

    // find user
    const user = (
      await usersTable.findByUID({ uid: userUID, includeAll: false })
    ).data.users;

    if (user === null) {
      throw new CreateError(translate(lang, "account_not_found"), 404);
    }

    if (user?.id_cirtificate_uid) {
      let result = (await db.methods.Documents({ translate, logger, CreateError, lang })
        .findByUID({ documentUID: user.id_cirtificate_uid })).data.documents;

      const minioClient = new Minio.Client({
        endPoint: 's3.amazonaws.com',
        port: 443,
        useSSL: true,
        accessKey: process.env.S3_ACCESS_KEY,
        secretKey: process.env.S3_SECRET_ACCESS_KEY,
      });

      user.cirtificate = await minioClient.presignedUrl(
        'GET',
        process.env.S3_BUCKET_NAME,
        result.url,
        24 * 60 * 60 * 7
      );
    }

    return {
      msg: translate(lang, "success"),
      data: { user },
    };
  } catch (error) {
    if (error instanceof CreateError) {
      throw error;
    }
    logger.error("GET: Failed to login user", error);
    throw new Error(error.message);
  }
}
