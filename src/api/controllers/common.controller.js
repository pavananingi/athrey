const logger = require('../../utils/logger').logger;
const fromUseCase = require('../use-cases/common');
const fromAdaptReq = require('../../utils/adapt-req');
const fromcreateError = require('../../error/dp-error');
const fromDataValidator = require('../services').Services;
const fromCrypto = require('../lib/crypto');
const translator = require('../../i18n/msg');
const db = require('../lib/database');

const fromAC = require('../../roles');


/*
 * @desc Get the urls for uploading the files with temproray authorisation
 * @params {string}type - type of the files you are trying to upload
 * @returns {object}urls - urls with the header to upload the file
 */
exports.postGenerateUrls = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.commonUseCases
            .GenerateUploadUrls({
                CreateError: fromcreateError.CreateError,
                logger: logger,
                translate: translator,
                request: request,
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
