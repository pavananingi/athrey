const logger = require('../../utils/logger').logger;
const fromUseCase = require('../use-cases/token');
const fromAdaptReq = require('../../utils/adapt-req');
const fromcreateError = require('../../error/dp-error');
const fromDataValidator = require('../services').Services;
const fromCrypto = require('../lib/crypto');
const translator = require('../../i18n/msg');
const db = require('../lib/database');
const fromToken = require('../lib/token');
const fromStore = require('../lib/store').store

const fromAC = require('../../roles');

/*
 * @desc create the login token
 * @returns {object}token - login token
 */
exports.createToken = async (req, res, next) => {
    try {
        const request = fromAdaptReq.adaptReq(req, res);
        const result = await fromUseCase.CreateLoginToken({
            CreateError: fromcreateError.CreateError,
            DataValidator: fromDataValidator.DataValidator,
            logger: logger,
            translate: translator,
            request: request,
            db: db.database,
            ac: fromAC,
            token: fromToken.token,
            store: fromStore,
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
