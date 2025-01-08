const logger = require('../../utils/logger').logger;
const fromUseCase = require('../use-cases/insurance');
const fromAdaptReq = require('../../utils/adapt-req');
const fromcreateError = require('../../error/dp-error');
const fromDataValidator = require('../services').Services;
const fromCrypto = require('../lib/crypto');
const translator = require('../../i18n/msg');
const db = require('../lib/database');

const fromAC = require('../../roles');

/*
 * @desc create new insurance
 * @returns {object}insurance - details of the insurance created
 */
exports.createInsurance = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.Create({
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
    } catch (error) {
        // console.log(error)
        next(error);
    }
}

/*
 * @desc Get the registered insurance
 * @params { uuid }uid - UUID of the user
 * @returns { array }insurance - all the insurance user have registered
 */
exports.getInsurances = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.Find({
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
    } catch (error) {
        // console.log(error)
        next(error);
    }
}


/*
 * @desc Delete insurance details
 * @returns 
 */
exports.deleteInsurance = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.Delete({
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
    } catch (error) {
        // console.log(error)
        next(error);
    }
}


