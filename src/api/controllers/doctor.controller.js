'use strict';

const logger = require('../../utils/logger').logger;
const fromUseCase = require('../use-cases/doctor');
const fromAdaptReq = require('../../utils/adapt-req');
const fromcreateError = require('../../error/dp-error');
const fromDataValidator = require('../services').Services;
const fromCrypto = require('../lib/crypto');
const translator = require('../../i18n/msg');
const db = require('../lib/database');

const fromAC = require('../../roles');


/*
 * @desc Get the registered doctors details
 * @returns { array }doctors - all the doctors details
 */
exports.getDoctors = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.FindDoctors({
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
 * @desc Register doctor details
 * @returns {object}doctor - details of the registered details
 */
exports.createDoctor = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.RegisterDoctor({
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
 * @desc Update doctor details
 * @returns {object}doctor - details of the updated doctor
 */
exports.updateDoctors = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.UpdateDoctor({
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
 * @desc Delete doctor details
 * @returns
 */
exports.deleteDoctors = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.DeleteDoctor({
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
 * @desc Register doctor practice details
 * @returns {object}doctor - practice details
 */
exports.createDoctorPractice = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.CreateDoctorPractice({
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
 * @desc get doctor practice details
 * @returns {object}practise - practice details
 */
exports.getDoctorPractice = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.FindDoctorPractice({
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
 * @desc update doctor practice details
 * @returns {object}practise - practice details
 */
exports.updateDoctorPractice = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.UpdateDoctorPractice({
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
 * @desc Delete doctor practice details
 * @returns
 */
exports.deleteDoctorPractice = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.DeleteDoctorPractice({
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
 * @desc Update doctor bank details
 * @returns {object}doctor - bank details
 */
exports.updateDoctorBank = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.UpdateDoctorBank({
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
 * @desc get doctor bank details
 * @returns {object}doctor - bank details
 */
exports.getDoctorBank = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.FindDoctorBank({
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

