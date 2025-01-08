const logger = require('../../utils/logger').logger;
const fromUseCase = require('../use-cases/devices');
const fromAdaptReq = require('../../utils/adapt-req');
const fromcreateError = require('../../error/dp-error');
const fromDataValidator = require('../services').Services;
const fromCrypto = require('../lib/crypto');
const translator = require('../../i18n/msg');
const db = require('../lib/database');

const fromAC = require('../../roles');


/*
 * @desc Get the registered devices for receiving notifications
 * @params { uuid }uid - UUID of the user
 * @params { string }device_id - device id
 * @returns { array }devices - all the devices user have registered
 */
exports.getDevices = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.devicesUseCases
            .FindDevice({
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
 * @desc Register new device
 * @returns {object}devices - details of the registered device
 */
exports.createDevices = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.devicesUseCases
            .RegisterDevice({
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
 * @desc Update device details
 * @returns {object}devices - details of the updated device
 */
exports.updateDevices = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.devicesUseCases
            .UpdateDevice({
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
 * @desc Delete device details
 * @returns 
 */
exports.deleteDevices = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.devicesUseCases
            .DeleteDevice({
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
