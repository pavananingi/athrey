const logger = require("../../utils/logger").logger;
const fromUseCase = require("../use-cases/tempUser").tempUserUseCases;
const fromAdaptReq = require("../../utils/adapt-req");
const fromcreateError = require("../../error/dp-error");
const fromDataValidator = require("../services").Services;
const fromCrypto = require("../lib/crypto");
const translator = require("../../i18n/msg");
const db = require("../lib/database");
const fromMailer = require("../lib/mailer");
const fromAC = require("../../roles");
const fromNotifications = require("../lib/notification");

const fromUseCaseConsultation = require("../use-cases/consultations");

exports.postCreateTempUser = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .CreateTempUser({
        CreateError: fromcreateError.CreateError,
        DataValidator: fromDataValidator.DataValidator,
        logger: logger,
        translate: translator,
        crypto: fromCrypto.crypto,
        request: request,
        db: db.database,
        mailer: fromMailer.mailer,
      })
      .execute();

    const resultt = await fromUseCaseConsultation
      .CreateTempUserConsultation({
        CreateError: fromcreateError.CreateError,
        DataValidator: fromDataValidator.DataValidator,
        logger: logger,
        translate: translator,
        request: request,
        db: db.database,
        ac: fromAC,
        notifications: fromNotifications,
        mailer: fromMailer.mailer,
        tempuserdata: result,
      })
      .execute();
    return res.status(201).json({
      msg: resultt.msg,
      data: { ...resultt.data },
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};
