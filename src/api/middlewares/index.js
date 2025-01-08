const fromSetLang = require('./set-language');
const fromIslogged = require('./is-logged');
const fromVerifyRefreshToken = require('./verify-refresh-token');

const appMiddlewares = {
    setLanguage: fromSetLang,
    isLogged: fromIslogged.isLogged,
    verifyRefreshToken: fromVerifyRefreshToken.verifyRefreshToken
}

module.exports = appMiddlewares;