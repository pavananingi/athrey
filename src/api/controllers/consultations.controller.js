const logger = require("../../utils/logger").logger;
const fromUseCase = require("../use-cases/consultations");
const fromAdaptReq = require("../../utils/adapt-req");
const fromcreateError = require("../../error/dp-error");
const fromDataValidator = require("../services").Services;
const translator = require("../../i18n/msg");
const db = require("../lib/database");
const fromNotifications = require("../lib/notification");
const fromAC = require("../../roles");
const fromMailer = require("../lib/mailer");
const fromPayment = require("../lib/payment");

/*
 * @desc Create consultation
 * @returns {object}consultation - consultation created
 */
exports.createConsultation = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .CreateConsultation({
        CreateError: fromcreateError.CreateError,
        DataValidator: fromDataValidator.DataValidator,
        logger: logger,
        translate: translator,
        request: request,
        db: db.database,
        ac: fromAC,
        notifications: fromNotifications,
        mailer: fromMailer.mailer,
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

exports.updateConsultation = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .UpdateConsultation({
        CreateError: fromcreateError.CreateError,
        DataValidator: fromDataValidator.DataValidator,
        logger: logger,
        translate: translator,
        request: request,
        db: db.database,
        ac: fromAC,
      })
      .execute();
    return res.status(200).json({
      msg: result.msg,
      data: { ...result.data },
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.updateConsultationDoctorReport = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase.Doctor.UpdateConsultationDoctorReport({
      CreateError: fromcreateError.CreateError,
      DataValidator: fromDataValidator.DataValidator,
      logger: logger,
      translate: translator,
      request: request,
      db: db.database,
      ac: fromAC,
      mailer: fromMailer.mailer,
    }).execute();
    return res.status(200).json({
      msg: result.msg,
      data: { ...result.data },
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.updateConsultationDoctorCompleted = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase.Doctor.MarkConsultationDoctorCompleted({
      CreateError: fromcreateError.CreateError,
      logger: logger,
      translate: translator,
      request: request,
      db: db.database,
      ac: fromAC,
      mailer: fromMailer.mailer,
      payment: fromPayment,
    }).execute();
    return res.status(200).json({
      msg: result.msg,
      data: { ...result.data },
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.updateConsultationDoctorCharge = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase.Doctor.UpdateConsultationCharge({
      CreateError: fromcreateError.CreateError,
      DataValidator: fromDataValidator.DataValidator,
      logger: logger,
      translate: translator,
      request: request,
      db: db.database,
      ac: fromAC,
    }).execute();
    return res.status(200).json({
      msg: result.msg,
      data: { ...result.data },
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.createConsultationDoctorInvoice = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase.Doctor.CreateConsultationDoctorInvoiceId({
      CreateError: fromcreateError.CreateError,
      DataValidator: fromDataValidator.DataValidator,
      logger: logger,
      translate: translator,
      request: request,
      db: db.database,
      ac: fromAC,
      mailer: fromMailer.mailer,
      payment: fromPayment,
    }).execute();
    return res.status(200).json({
      msg: result.msg,
      data: { ...result.data },
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.getConsultationsList = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .GetConsultationsList({
        CreateError: fromcreateError.CreateError,
        logger: logger,
        translate: translator,
        request: request,
        db: db.database,
        ac: fromAC,
      })
      .execute();
    return res.status(200).json({
      msg: result.msg,
      data: { ...result.data },
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.getScheduledConsultations = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .GetScheduledConsultations({
        CreateError: fromcreateError.CreateError,
        logger: logger,
        translate: translator,
        request: request,
        db: db.database,
        ac: fromAC,
      })
      .execute();
    return res.status(200).json({
      msg: result.msg,
      data: { ...result.data },
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.getOpenConsultations = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .GetOpenConsultations({
        CreateError: fromcreateError.CreateError,
        logger: logger,
        translate: translator,
        request: request,
        db: db.database,
        ac: fromAC,
      })
      .execute();
    return res.status(200).json({
      msg: result.msg,
      data: { ...result.data },
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.getCompletedConsultations = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .GetCompletedConsultations({
        CreateError: fromcreateError.CreateError,
        logger: logger,
        translate: translator,
        request: request,
        db: db.database,
        ac: fromAC,
      })
      .execute();
    return res.status(200).json({
      msg: result.msg,
      data: { ...result.data },
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.getConsultation = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .GetConsultations({
        CreateError: fromcreateError.CreateError,
        logger: logger,
        translate: translator,
        request: request,
        db: db.database,
        ac: fromAC,
      })
      .execute();
    return res.status(200).json({
      msg: result.msg,
      data: { ...result.data },
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.getReviewConsultations = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .GetReviewConsultations({
        CreateError: fromcreateError.CreateError,
        logger: logger,
        translate: translator,
        request: request,
        db: db.database,
        ac: fromAC,
      })
      .execute();
    return res.status(200).json({
      msg: result.msg,
      data: { ...result.data },
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.getCancelledConsultations = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .GetCancelledConsultations({
        CreateError: fromcreateError.CreateError,
        logger: logger,
        translate: translator,
        request: request,
        db: db.database,
        ac: fromAC,
      })
      .execute();
    return res.status(200).json({
      msg: result.msg,
      data: { ...result.data },
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.getScheduledConsultationsCount = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .GetScheduledConsultationsCount({
        CreateError: fromcreateError.CreateError,
        logger: logger,
        translate: translator,
        request: request,
        db: db.database,
        ac: fromAC,
      })
      .execute();
    return res.status(200).json({
      msg: result.msg,
      data: { ...result.data },
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.rescheduleConsultation = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .RescheduleConsultation({
        CreateError: fromcreateError.CreateError,
        DataValidator: fromDataValidator.DataValidator,
        logger: logger,
        translate: translator,
        request: request,
        db: db.database,
        ac: fromAC,
        notifications: fromNotifications,
        mailer: fromMailer.mailer,
      })
      .execute();
    return res.status(200).json({
      msg: result.msg,
      data: { ...result.data },
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.cancelConsultation = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .CancelConsultation({
        CreateError: fromcreateError.CreateError,
        DataValidator: fromDataValidator.DataValidator,
        logger: logger,
        translate: translator,
        request: request,
        db: db.database,
        ac: fromAC,
        notifications: fromNotifications,
        mailer: fromMailer.mailer,
      })
      .execute();
    return res.status(200).json({
      msg: result.msg,
      data: { ...result.data },
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.assignDoctor = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase.Doctor.AssignDoctor({
      CreateError: fromcreateError.CreateError,
      DataValidator: fromDataValidator.DataValidator,
      logger: logger,
      translate: translator,
      request: request,
      db: db.database,
      ac: fromAC,
      notifications: fromNotifications,
      mailer: fromMailer.mailer,
    }).execute();
    return res.status(201).json({
      msg: result.msg,
      data: { ...result.data },
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.assignDoctortoTempPatient = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase.Doctor.AssignDoctorToTempPatient({
      CreateError: fromcreateError.CreateError,
      DataValidator: fromDataValidator.DataValidator,
      logger: logger,
      translate: translator,
      request: request,
      db: db.database,
      ac: fromAC,
      notifications: fromNotifications,
      mailer: fromMailer.mailer,
    }).execute();
    return res.status(201).json({
      msg: result.msg,
      data: { ...result.data },
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.getDoctorConsultations = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase.Doctor.GetDoctorConsultations({
      CreateError: fromcreateError.CreateError,
      logger: logger,
      translate: translator,
      request: request,
      db: db.database,
      ac: fromAC,
    }).execute();
    return res.status(200).json({
      msg: result.msg,
      data: { ...result.data },
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};
