const logger = require('../../utils/logger').logger;
const fromUseCase = require('../use-cases/treatments');
const fromAdaptReq = require('../../utils/adapt-req');
const fromcreateError = require('../../error/dp-error');
const fromDataValidator = require('../services').Services;
const fromCrypto = require('../lib/crypto');
const translator = require('../../i18n/msg');
const db = require('../lib/database');

const fromAC = require('../../roles');


/*
 * @desc Create treatment category details
 * @returns {array}categories - categories created
 */
exports.createTreatmentCategory = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.categories
            .CreateCategories({
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

exports.updateTreatmentCategory = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.categories
            .UpdateCategory({
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


exports.findTreatmentCategory = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.categories
            .FindCategory({
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


exports.deleteTreatmentCategory = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.categories
            .DeleteCategory({
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

exports.createTreatment = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.treatments
            .CreateTreatment({
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


exports.updateTreatment = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.treatments
            .UpdateTreatment({
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


exports.findTreatment = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.treatments
            .FindTreatment({
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

exports.deleteTreatment = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.treatments
            .DeleteTreatment({
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


exports.createSpecialization = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.specializations
            .CreateSpecialization({
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

exports.updateSpecialization = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.specializations
            .UpdateSpecialization({
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


exports.findSpecialization = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.specializations
            .FindSpecialization({
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

exports.deleteSpecialization = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.specializations
            .DeleteSpecialization({
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
