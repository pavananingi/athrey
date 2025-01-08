const logger = require('../../utils/logger').logger;
const fromUseCase = require('../use-cases/documents');
const fromAdaptReq = require('../../utils/adapt-req');
const fromcreateError = require('../../error/dp-error');
const fromDataValidator = require('../services').Services;
const fromCrypto = require('../lib/crypto');
const translator = require('../../i18n/msg');
const db = require('../lib/database');

const fromAC = require('../../roles');




/*
 * @desc Create the documents which is uploaded
 * @params {string}userUid - user UID you want to create the records under
 * @returns {array}urls - object of the urls  
 */
exports.postPatientDocuments = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase
            .CreatePatientDocuments({
                CreateError: fromcreateError.CreateError,
                logger: logger,
                translate: translator,
                request: request,
                db: db.database,
                ac: fromAC,
                DataValidator: fromDataValidator.DataValidator
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
 * @desc Upload and Create documents
 * @params {string}userUid - user UID you want to create the records under
 * @returns {array}urls - object of the urls  
 */
exports.uploadDocuments = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase
            .UploadDocuments({
                CreateError: fromcreateError.CreateError,
                logger: logger,
                translate: translator,
                request: request,
                db: db.database,
                ac: fromAC,
                DataValidator: fromDataValidator.DataValidator
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
 * @desc Upload and Create documents
 * @params {string}userUid - user UID you want to create the records under
 * @returns {array}urls - object of the urls  
 */
exports.uploadOpenDocuments = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase
            .UploadOpenDocuments({
                CreateError: fromcreateError.CreateError,
                logger: logger,
                translate: translator,
                request: request,
                db: db.database,
                ac: fromAC,
                DataValidator: fromDataValidator.DataValidator
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
 * @desc Get the documents list
 * @params {string}userUid - user UID you want to create the records under
 * @returns {array}urls - object of the urls  
 */
exports.getPatientDocumentsList = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase
            .GetPatientDocumentsList({
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
}

/*
 * @desc Get the documents list
 * @params {string}userUid - user UID you want to create the records under
 * @returns {array}urls - object of the urls  
 */
exports.getPatientDocument = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase
            .GetPatientDocument({
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
}

/*
 * @desc update the document
 * @params {string}userUid - user UID you want to update the records under
 * @params {string}documentUID - document UIDs you want to update the records under
 * @returns {object}document - object of the updated document
 */
exports.updatePatientDocument = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase
            .UpdateDocument({
                CreateError: fromcreateError.CreateError,
                logger: logger,
                translate: translator,
                request: request,
                db: db.database,
                ac: fromAC,
                DataValidator: fromDataValidator.DataValidator
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
 * @desc delete the documents list
 * @params {string}userUid - user UID you want to create the records under
 * @params {string}documentUID - document UIDs you want to create the records under
 * @returns {array}urls - object of the urls  
 */
exports.deletePaitentDocument = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase
            .DeletePatientDocuments({
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
}