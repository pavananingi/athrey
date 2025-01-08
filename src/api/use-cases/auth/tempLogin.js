const fromEntities = require("../../entity");
const config = require("../../../config/app.config.json");
const e = require("express");
const bruteForce =
  require("../../services/brute-force-attack-prevention.service").bruteForce;

const checkBlocked =
  require("../../services/brute-force-attack-prevention.service").checkBlocked;

exports.tempLogin = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  crypto,
  store,
  db,
  request,
  loginTrials,
  token,
  ipaddress,
}) => {
  return Object.freeze({
    execute: async () => {
      try {
        const lang = request.lang;
        const userID = request.body.uid;

        const tempUsersTable = db.methods.TempUser({
          translate,
          logger,
          CreateError,
          lang,
        });

        const user = (
          await tempUsersTable.findByUID({
            uid: userID,
          })
        ).data.TempUser;

        if (!user) {
          throw new CreateError(translate(lang, "user_not_found"));
        }

        const consultationTable = db.methods.Consultations({
          translate,
          logger,
          CreateError,
          lang,
        });

        const tempUserConsultation =
          await consultationTable.findByUIDTempPatientUID({
            patientUID: userID,
          });

        const tokenGenerator = token.jwt({
          CreateError,
          translate,
          lang,
          logger,
        });

        const bearerToken = (
          await tokenGenerator.generateBearerToken({
            uid: user.uid,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            role: "patient",
            temp_user: true,
          })
        ).data.token;

        const refreshToken = (
          await tokenGenerator.generateRefreshToken({
            uid: user.uid,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            role: "patient",
            temp_user: true,
          })
        ).data.token;

        return {
          msg: translate(lang, "success"),
          data: {
            user: user,
            token: bearerToken,
            refresh_token: refreshToken,
            consultation: tempUserConsultation.data.consultations,
          },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error("POST: Failed to login user", error);
        throw new Error(error.message);
      }
    },
  });
};
