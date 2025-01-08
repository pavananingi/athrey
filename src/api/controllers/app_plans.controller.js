const logger = require("../../utils/logger").logger;
const fromUseCase = require("../use-cases/appPlans").plansUseCases;
const fromAdaptReq = require("../../utils/adapt-req");
const fromcreateError = require("../../error/dp-error");
const fromDataValidator = require("../services").Services;
const translator = require("../../i18n/msg");
const db = require("../lib/database");
const fromAC = require("../../roles");

exports.createPlans = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase
            .createPlans({
                CreateError: fromcreateError.CreateError,
                DataValidator: fromDataValidator.DataValidator,
                logger: logger,
                translate: translator,
                request: request,
                db: db.database,
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

exports.getPlans = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase
            .getPlans({
                CreateError: fromcreateError.CreateError,
                DataValidator: fromDataValidator.DataValidator,
                logger: logger,
                translate: translator,
                request: request,
                db: db.database,
                ac: fromAC,
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


exports.deletePlan = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase
            .deletePlan({
                CreateError: fromcreateError.CreateError,
                DataValidator: fromDataValidator.DataValidator,
                logger: logger,
                translate: translator,
                request: request,
                db: db.database,
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