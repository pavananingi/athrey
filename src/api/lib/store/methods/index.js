const CONFIG = require('../../../../config/app.config.json');

const redisClient = require('../connection');


const refreshTokenPrefix = CONFIG.refreshToken.storage.pathPrefix;
const refreshTokenTTL = CONFIG.refreshToken.storage.ttl;

const passwordResetOtpPrefix = CONFIG.passwordReset.storage.pathPrefix;
const passwordResetOtpTTL = CONFIG.passwordReset.storage.ttl;


exports.Store = ({ lang = 'de', CreateError, translate, logger }) => {

    return Object.freeze({
        storeRefreshToken: async ({ token, userUID, ip, ua }) => {
            try {
                const keyPath = `${refreshTokenPrefix}${userUID}:${token}`;
                const storeToken = await redisClient
                    .set(keyPath, JSON.stringify({
                        user_uid: userUID,
                        created_on: new Date().toISOString(),
                        ip,
                        ua
                    }));
                const setTokenExpire = await redisClient
                    .expire(keyPath, refreshTokenTTL);
                return {
                    msg: translate(lang, 'success'),
                    data: {}
                };
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Error while storing refresh token to store', error);
                throw new Error(translate(lang, 'error_unknown'));
            }
        },
        getRefreshToken: async ({ userUID, token }) => {
            try {
                const keyPath = `${refreshTokenPrefix}${userUID}:${token}`
                //get the key
                const sessData = await redisClient
                    .get(keyPath);

                // key not found
                if (sessData === null) {
                    return {
                        msg: translate(lang, 'session_expired'),
                        data: null
                    }
                }

                // All ok
                return {
                    msg: translate(lang, 'success'),
                    data: { ...JSON.parse(sessData) }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Error while fetching refresh token from store', error);
                throw new Error(translate(lang, 'error_unknown'));
            }
        },
        sendOtp: async ({ otp, email }) => {
            try {
                const keyPath = `athrey_dev:sendOtp:${email}`;
                const storeToken = await redisClient
                    .set(keyPath, JSON.stringify({
                        otp
                    }));
                const setTokenExpire = await redisClient
                    .expire(keyPath, passwordResetOtpTTL);
                return {
                    msg: translate(lang, 'success'),
                    data: {}
                };
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Error while storing otp', error);
                throw new Error(translate(lang, 'error_unknown'));
            }
        },
        verifySendOtp: async ({ email }) => {
            try {
                const keyPath = `athrey_dev:sendOtp:${email}`;
                const tokenData = await redisClient
                    .get(keyPath);

                return {
                    msg: translate(lang, 'success'),
                    data: { otp: tokenData === null ? null : JSON.parse(tokenData).otp }
                };
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Error while fetching otp from store', error);
                throw new Error(translate(lang, 'error_unknown'));
            }
        },
        deleteRefreshToken: async ({ token, userUID }) => {
            try {
                const keyPath = `${refreshTokenPrefix}${userUID}:${token}`;

                await redisClient.del(keyPath);
                return {
                    msg: translate(lang, 'success'),
                    data: {}
                };
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Error while deleting refresh token from store', error);
                throw new Error(translate(lang, 'error_unknown'));
            }
        },
        storeResetOtp: async ({ otp, email }) => {
            try {
                const keyPath = `${passwordResetOtpPrefix}${email}`;
                const storeToken = await redisClient
                    .set(keyPath, JSON.stringify({
                        otp
                    }));
                const setTokenExpire = await redisClient
                    .expire(keyPath, passwordResetOtpTTL);
                return {
                    msg: translate(lang, 'success'),
                    data: {}
                };
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Error while storing otp', error);
                throw new Error(translate(lang, 'error_unknown'));
            }
        },
        getResetOtp: async ({ email }) => {
            try {
                const keyPath = `${passwordResetOtpPrefix}${email}`;
                const tokenData = await redisClient
                    .get(keyPath);

                return {
                    msg: translate(lang, 'success'),
                    data: { otp: tokenData === null ? null : JSON.parse(tokenData).otp }
                };
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Error while fetching otp from store', error);
                throw new Error(translate(lang, 'error_unknown'));
            }
        },
        deleteResetOtp: async ({ email }) => {
            try {
                const keyPath = `${passwordResetOtpPrefix}${email}`;

                await redisClient.del(keyPath);

                return {
                    msg: translate(lang, 'success'),
                    data: {}
                };
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Error while deleting otp from store', error);
                throw new Error(translate(lang, 'error_unknown'));
            }
        }
    });
}

