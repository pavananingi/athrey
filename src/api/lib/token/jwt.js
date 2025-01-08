const fs = require("fs");
const path = require("path");
const CONFIG = require("../../../config/app.config.json");

const jsonWebToken = require("jsonwebtoken");

// PRIVATE and PUBLIC key paths
const privateKey = path.join(
  __dirname,
  "..",
  "..",
  "..",
  CONFIG.jwt.privateKey
);
const publicKey = path.join(__dirname, "..", "..", "..", CONFIG.jwt.publicKey);

// PRIVATE and PUBLIC key
const privateKEY = fs.readFileSync(privateKey, "utf8");
const publicKEY = fs.readFileSync(publicKey, "utf8");

const defaultPayload = {
  issuer: CONFIG.jwt.issuer,
  algorithm: CONFIG.jwt.algorithm,
};

var verifyOptions = {
  issuer: defaultPayload.issuer,
  expiresIn: CONFIG.jwt.expiry,
  algorithm: [defaultPayload.algorithm],
};

const util = require("util");
const { logger } = require("../../../utils/logger");
const signPromise = util.promisify(jsonWebToken.sign);
const verifyPromise = util.promisify(jsonWebToken.verify);

exports.jwt = ({ CreateError, translate, lang, logger }) => {
  return Object.freeze({
    generateVerifyToken: async (
      payload = {
        email,
        uid,
      }
    ) => {
      try {
        const signOptions = {
          issuer: defaultPayload.issuer,
          expiresIn: CONFIG.verificationToken.jwtOptions.expiry,
          algorithm: defaultPayload.algorithm,
        };
        const token = await signPromise(
          { ...payload, reason: "auth" },
          privateKEY,
          signOptions
        );
        return {
          msg: "Verification token generated",
          data: {
            token: token,
          },
        };
      } catch (error) {
        logger.error("Failed to generate Verification JWT token", error);
        throw new Error("Failed to generate token");
      }
    },
    generateRefreshToken: async (
      payload = {
        firstname,
        lastname,
        email,
        uid,
        roles,
        temp_user,
      }
    ) => {
      try {
        console.log(
          payload.temp_user,
          CONFIG.verificationToken.jwtOptions.tempExpiry
        );
        if (payload.temp_user) {
          delete payload.temp_user;
        }
        const signOptions = {
          issuer: defaultPayload.issuer,
          expiresIn: payload.temp_user
            ? CONFIG.verificationToken.jwtOptions.tempExpiry
            : CONFIG.refreshToken.jwtOptions.expiry,
          algorithm: defaultPayload.algorithm,
        };
        const token = await signPromise(payload, privateKEY, signOptions);
        return {
          msg: "Refresh token generated",
          data: {
            token: token,
          },
        };
      } catch (error) {
        logger.error("Failed to generate refresh JWT token", error);
        throw new Error("Failed to generate token");
      }
    },
    generateBearerToken: async (
      payload = {
        firstname,
        lastname,
        email,
        uid,
        roles,
        temp_user: false,
      }
    ) => {
      try {
        console.log(
          payload.temp_user,
          CONFIG.verificationToken.jwtOptions.tempExpiry
        );
        const signOptions = {
          issuer: defaultPayload.issuer,
          expiresIn: payload.temp_user
            ? CONFIG.verificationToken.jwtOptions.tempExpiry
            : CONFIG.refreshToken.jwtOptions.expiry,
          algorithm: defaultPayload.algorithm,
        };
        if (payload.temp_user) {
          delete payload.temp_user;
        }
        const token = await signPromise(payload, privateKEY, signOptions);
        return {
          msg: "Auth token generated",
          data: {
            token: token,
          },
        };
      } catch (error) {
        logger.error("Failed to generate bearer JWT token", error);
        throw new Error("Failed to generate token");
      }
    },
    verifyToken: async ({ token }) => {
      try {
        const status = await verifyPromise(token, publicKEY, verifyOptions);
        return {
          msg: "Auth token verified",
          data: {
            ...status,
          },
        };
      } catch (error) {
        let errorMsg = "invalid_token";
        switch (error.name) {
          case "TokenExpiredError":
            logger.error("token verification expired", error.message);
            errorMsg = "session_expired";
            break;
          case "JsonWebTokenError":
            logger.error("token verification error/tampered", error.message);
            errorMsg = "session_error";
            break;
          case "NotBeforeError":
            logger.error(
              "token verification current time is before the nbf claim",
              error.message
            );
            errorMsg = "session_expired";
            break;
          default:
            logger.error("token verification error", error);
            break;
        }
        throw new CreateError(translate(lang, errorMsg));
      }
    },
  });
};
