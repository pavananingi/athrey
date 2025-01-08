const CreateError = require('../../error/dp-error').CreateError;
const CONFIG = require('../../config/app.config.json');
const keyStore = require('../lib/store').store;
const translate = require('../../i18n/msg');
const tokenHandler = require('../lib/token').token;
const logger = require('../../utils/logger').logger;

const refreshTokenCookieName = CONFIG.refreshToken.cookie.name;

module.exports.verifyRefreshToken = async (req, res, next) => {
    try {

        const lang = res.locals.lang;

        // refresh token validation
        const refreshToken = req.cookies[refreshTokenCookieName];

        if (refreshToken === undefined) {
            res.clearCookie(refreshTokenCookieName);
            return res.status(401).json({ msg: translate(lang, 'token_required'), data: {} })
        }

        const tokenMethods = tokenHandler.jwt({
            lang,
            CreateError: CreateError,
            translate,
            logger
        });

        let refreshTokenStatus;
        try {
            refreshTokenStatus = (await tokenMethods.verifyToken({ token: refreshToken })).data;
        } catch (error) {
            return res.status(401).json({ msg: error.message, data: {} })
        }

        const refreshTokenData = (await keyStore.Store({
            lang,
            CreateError,
            translate,
            logger
        }).getRefreshToken({ userUID: refreshTokenStatus.uid, token: refreshToken }))
            .data;

        if (refreshTokenData === null) {
            res.clearCookie(refreshTokenCookieName);
            return res.status(401).json({ msg: translate(lang, 'login_required'), data: {} });
        }

        res.locals = {
            ...res.locals,
            refreshToken: refreshToken,
            ...refreshTokenStatus
        };

        return next();
    } catch (error) {
        console.log('Error-while validating session', error);
        return res.status(500).json({ msg: translate(lang, 'error_unknown'), data: {} });
    }
}