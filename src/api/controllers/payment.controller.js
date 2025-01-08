const logger = require("../../utils/logger").logger;
const fromUseCase = require("../use-cases/Payment").paymentUseCases;
const fromWebhookUseCase = require("../use-cases/webhook");
const fromAdaptReq = require("../../utils/adapt-req");
const fromcreateError = require("../../error/dp-error");
const fromDataValidator = require("../services").Services;
const translator = require("../../i18n/msg");
const db = require("../lib/database");
const fromAC = require("../../roles");
const fromPayment = require("../lib/payment");

exports.createPayment = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase
            .createPayment({
                CreateError: fromcreateError.CreateError,
                DataValidator: fromDataValidator.DataValidator,
                logger: logger,
                translate: translator,
                request: request,
                db: db.database,
                ac: fromAC,
                payment: fromPayment
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

exports.webhook = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromWebhookUseCase
            .webhook({
                CreateError: fromcreateError.CreateError,
                DataValidator: fromDataValidator.DataValidator,
                logger: logger,
                translate: translator,
                request: request,
                db: db.database,
                ac: fromAC,
                payment: fromPayment
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
