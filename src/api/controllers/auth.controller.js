const logger = require("../../utils/logger").logger;
const fromUseCase = require("../use-cases/auth").authUseCases;
const fromAdaptReq = require("../../utils/adapt-req");
const fromcreateError = require("../../error/dp-error");
const fromDataValidator = require("../services").Services;
const fromCrypto = require("../lib/crypto");
const translator = require("../../i18n/msg");
const db = require("../lib/database");
const fromToken = require("../lib/token");
const fromStore = require("../lib/store").store;
const fromMailer = require("../lib/mailer");
const fromPayment = require("../lib/payment");

const APP_CONFIG = require("../../config/app.config.json");

const cookieName = APP_CONFIG.refreshToken.cookie.name;
const cookieConfig = {
  maxAge: parseInt(APP_CONFIG.refreshToken.cookie.config.maxAge),
  httpOnly: APP_CONFIG.refreshToken.cookie.config.httpOnly,
  secure: APP_CONFIG.refreshToken.cookie.config.secure,
  sameSite: APP_CONFIG.refreshToken.cookie.config.sameSite,
};
const emailLinkExpirationDuration = APP_CONFIG.emailLinkExpirationDuration;

exports.login = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    // await bruteForce({
    //   CreateError: fromcreateError.CreateError,
    //   lang: request.lang,
    //   ipaddress: req.headers["x-forwarded-for"] || "a",
    //   translate: translator,
    //   logger,
    //   db: db.database,
    // });
    const ipaddressTable = db.database.methods.Ipaddress({
      translate: translator,
      logger,
      CreateError: fromcreateError.CreateError,
      lang: request.lang,
    });
    ipaddressesList = (
      await ipaddressTable.findByAddress({
        ipaddress: req.headers["x-forwarded-for"] || "127.0.0.1",
      })
    ).data.ipaddresses;

    const result = await fromUseCase
      .Login({
        CreateError: fromcreateError.CreateError,
        DataValidator: fromDataValidator.DataValidator,
        logger: logger,
        translate: translator,
        crypto: fromCrypto.crypto,
        store: fromStore,
        db: db.database,
        request: request,
        token: fromToken.token,
        ipaddress: req.headers["x-forwarded-for"] || "127.0.0.1",
      })
      .execute();

    let status = await ipaddressTable.deleteByAddress({
      address: req.headers["x-forwarded-for"] || "127.0.0.1",
    }).msg;

    if (result.data.refresh_token !== undefined) {
      res.cookie(cookieName, result.data.refresh_token, cookieConfig);
    }

    const responseData = {
      user: result.data.user,
      token: result.data.token,
      refresh_token: result.data.refresh_token,
    };
    if (result.data.devices) {
      responseData.devices = result.data.devices;
    }
    return res.status(200).json({
      msg: result.msg,
      data: {
        ...responseData,
      },
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.postSignup = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .Signup({
        CreateError: fromcreateError.CreateError,
        DataValidator: fromDataValidator.DataValidator,
        logger: logger,
        translate: translator,
        crypto: fromCrypto.crypto,
        request: request,
        db: db.database,
        mailer: fromMailer.mailer,
        payment: fromPayment,
      })
      .execute();
    return res.status(201).json({
      msg: result.msg,
      data: { ...result.data },
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.generatePassword = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .GeneratePassword({
        CreateError: fromcreateError.CreateError,
        DataValidator: fromDataValidator.DataValidator,
        logger: logger,
        translate: translator,
        crypto: fromCrypto.crypto,
        request: request,
        db: db.database,
        mailer: fromMailer.mailer,
        payment: fromPayment,
      })
      .execute();
    return res.status(201).json({
      msg: result.msg,
      data: { ...result.data },
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.sendOtp = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);

    const result = await fromUseCase
      .SendOtp({
        CreateError: fromcreateError.CreateError,
        DataValidator: fromDataValidator.DataValidator,
        logger,
        translate: translator,
        request,
        store: fromStore,
        db: db.database,
        crypto: fromCrypto.crypto,
        mailer: fromMailer.mailer,
      })
      .execute();

    return res.status(200).json({
      msg: result.msg,
      data: {},
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.postRegister = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .Register({
        CreateError: fromcreateError.CreateError,
        DataValidator: fromDataValidator.DataValidator,
        logger: logger,
        translate: translator,
        crypto: fromCrypto.crypto,
        request: request,
        store: fromStore,
        db: db.database,
        mailer: fromMailer.mailer,
        payment: fromPayment,
      })
      .execute();
    return res.status(201).json({
      msg: result.msg,
      data: { ...result.data },
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.postlogout = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .Logout({
        CreateError: fromcreateError.CreateError,
        logger: logger,
        translate: translator,
        request: request,
        store: fromStore,
        db: db.database,
      })
      .execute();
    res.clearCookie(cookieName);
    return res.status(200).json({
      msg: result.msg,
      data: {},
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.postGenerateBearerToken = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .GenBearerToken({
        CreateError: fromcreateError.CreateError,
        logger: logger,
        translate: translator,
        request: request,
        token: fromToken.token,
      })
      .execute();
    return res.status(200).json({
      msg: result.msg,
      data: { token: result.data.token },
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.postPasswordReset = async (req, res, next) => {
  try {
    const request = await fromAdaptReq.adaptReq(req, res);

    const ipaddressTable = db.database.methods.Ipaddress({
      translate: translator,
      logger,
      CreateError: fromcreateError.CreateError,
      lang: request.lang,
    });

    const result = await fromUseCase
      .PasswordReset({
        CreateError: fromcreateError.CreateError,
        DataValidator: fromDataValidator.DataValidator,
        logger: logger,
        translate: translator,
        request: request,
        store: fromStore,
        db: db.database,
        crypto: fromCrypto.crypto,
        mailer: fromMailer.mailer,
        ipaddress: req.headers["x-forwarded-for"] || "a",
      })
      .execute();

    let status = await ipaddressTable.deleteByAddress({
      address: req.headers["x-forwarded-for"] || "a",
    }).msg;

    return res.status(200).json({
      msg: result.msg,
      data: {},
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.tempLogin = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .TempLogin({
        CreateError: fromcreateError.CreateError,
        DataValidator: fromDataValidator.DataValidator,
        logger: logger,
        translate: translator,
        crypto: fromCrypto.crypto,
        store: fromStore,
        db: db.database,
        request: request,
        token: fromToken.token,
        ipaddress: req.headers["x-forwarded-for"] || "a",
      })
      .execute();

    if (result.data.refresh_token !== undefined) {
      res.cookie(cookieName, result.data.refresh_token, cookieConfig);
    }

    const responseData = {
      user: result.data.user,
      token: result.data.token,
      refresh_token: result.data.refresh_token,
      consultation: result.data.consultation,
    };

    return res.status(200).json({
      msg: result.msg,
      data: {
        ...responseData,
      },
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const request = await fromAdaptReq.adaptReq(req, res);

    const result = await fromUseCase
      .VerifyEmail({
        CreateError: fromcreateError.CreateError,
        DataValidator: fromDataValidator.DataValidator,
        logger: logger,
        translate: translator,
        request: request,
        store: fromStore,
        db: db.database,
        crypto: fromCrypto.crypto,
        mailer: fromMailer.mailer,
        emailLinkExpirationDuration,
      })
      .execute();

    return res.status(200).json({
      msg: result.msg,
      data: {},
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
