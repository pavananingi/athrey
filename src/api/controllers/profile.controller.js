const logger = require('../../utils/logger').logger;
const fromUseCase = require('../use-cases/profile');
const fromAdaptReq = require('../../utils/adapt-req');
const fromcreateError = require('../../error/dp-error');
const fromDataValidator = require('../services').Services;
const fromCrypto = require('../lib/crypto');
const translator = require('../../i18n/msg');
const db = require('../lib/database');
const fromMailer = require("../lib/mailer");

const fromAC = require('../../roles');


/*
 * @desc Get the profile details of the user elements password for all roles
 * @params {uuid}uid - UUID of the user
 * @returns {object}user - all the user details along with roles
 */
exports.getProfile = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.profileUseCases
            .GetProfile({
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
 * @desc Update profile details only, roles cann't in this controller
 * @desc uses user role for authorisation
 * @
 * @returns {object}user - updated profile details
 */
exports.updateProfile = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.profileUseCases
            .UpdateProfile({
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
}
