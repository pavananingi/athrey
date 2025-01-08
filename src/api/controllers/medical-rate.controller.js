const logger = require('../../utils/logger').logger;
const fromUseCase = require('../use-cases/medical-rates');
const fromAdaptReq = require('../../utils/adapt-req');
const fromcreateError = require('../../error/dp-error');
const fromDataValidator = require('../services').Services;
const fromCrypto = require('../lib/crypto');
const translator = require('../../i18n/msg');
const db = require('../lib/database');

const fromAC = require('../../roles');

/*
 * @desc create new rate
 * @returns {object}medical-rates - details of the medical-rates created
 */
exports.createMedicalRate = async (req, res, next) => {
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
 * @desc Get the registered medical-rates
 * @returns { array }medical-rates - all the medical-rates user have registered
 */
exports.getMedicalRates = async (req, res, next) => {
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
 * @desc update the registered medical-rates
 * @returns { array }medical-rates - update the medical-rates user have registered
 */
exports.updateMedicalRate = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.Update({
            CreateError: fromcreateError.CreateError,
            DataValidator: fromDataValidator.DataValidator,
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
 * @desc Delete medical-rates details
 * @returns 
 */
exports.deleteMedicalRate = async (req, res, next) => {
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


