'use-strict';

const logger = require('../../utils/logger').logger;
const fromUseCase = require('../use-cases/admin');
const fromAdaptReq = require('../../utils/adapt-req');
const fromcreateError = require('../../error/dp-error');
const fromDataValidator = require('../services').Services;
const fromCrypto = require('../lib/crypto');
const fromMailer = require("../lib/mailer");
const translator = require('../../i18n/msg');
const db = require('../lib/database');

const fromAC = require('../../roles');

exports.getAdmins = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase.FindAdmins({
      CreateError: fromcreateError.CreateError,
      logger: logger,
      translate: translator,
      request: request,
      db: db.database,
      ac: fromAC
    }).execute();
    return res.status(200).json({
      msg: result.msg,
      data: { ...result.data },
    });
  } catch (e) {
    next(e);
  }
}

exports.inviteAdmin = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase.InviteAdmin({
      CreateError: fromcreateError.CreateError,
      DataValidator: fromDataValidator.DataValidator,
      logger: logger,
      translate: translator,
      crypto: fromCrypto.crypto,
      request: request,
      db: db.database,
      mailer: fromMailer.mailer,
      ac: fromAC
    }).execute();

    return res.status(201).json({
      msg: result.msg,
      data: { ...result.data },
    });
  } catch (e) {
    next(e);
  }
}

exports.createAdmin = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase.CreateAdmin({
      CreateError: fromcreateError.CreateError,
      DataValidator: fromDataValidator.DataValidator,
      logger: logger,
      translate: translator,
      crypto: fromCrypto.crypto,
      request: request,
      db: db.database,
      mailer: fromMailer.mailer,
      ac: fromAC
    }).execute();

    return res.status(201).json({
      msg: result.msg,
      data: { ...result.data },
    });
  } catch (e) {
    next(e);
  }
}

exports.checkAdminInvite = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase.CheckAdminInvite({
      CreateError: fromcreateError.CreateError,
      DataValidator: fromDataValidator.DataValidator,
      logger: logger,
      translate: translator,
      request: request,
      db: db.database,
    }).execute();

    return res.status(201).json({
      msg: result.msg,
      data: { ...result.data },
    });
  } catch (e) {
    next(e);
  }
}

exports.acceptAdminInvite = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase.AcceptAdminInvite({
      CreateError: fromcreateError.CreateError,
      DataValidator: fromDataValidator.DataValidator,
      logger: logger,
      translate: translator,
      crypto: fromCrypto.crypto,
      request: request,
      db: db.database,
    }).execute();

    return res.status(201).json({
      msg: result.msg,
      data: { ...result.data },
    });
  } catch (e) {
    next(e);
  }
}

exports.deleteAdmin = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase.DeleteAdmin({
      CreateError: fromcreateError.CreateError,
      DataValidator: fromDataValidator.DataValidator,
      logger: logger,
      translate: translator,
      request: request,
      db: db.database,
      ac: fromAC
    }).execute();

    return res.status(201).json({
      msg: result.msg,
      data: { ...result.data },
    });
  } catch (e) {
    next(e);
  }
}

exports.fetchAllUsers = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase.FindUsers({
      CreateError: fromcreateError.CreateError,
      DataValidator: fromDataValidator.DataValidator,
      logger: logger,
      translate: translator,
      crypto: fromCrypto.crypto,
      request: request,
      db: db.database,
      mailer: fromMailer.mailer,
      ac: fromAC
    }).execute();

    return res.status(201).json({
      msg: result.msg,
      data: { ...result.data },
    });
  } catch (e) {
    next(e);
  }
}


exports.updateDoctorStatus = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase.UpdateDoctorStatus({
      CreateError: fromcreateError.CreateError,
      DataValidator: fromDataValidator.DataValidator,
      logger: logger,
      translate: translator,
      crypto: fromCrypto.crypto,
      request: request,
      db: db.database,
      mailer: fromMailer.mailer,
      ac: fromAC
    }).execute();

    return res.status(201).json({
      msg: result.msg,
      data: {},
    });
  } catch (e) {
    next(e);
  }
}