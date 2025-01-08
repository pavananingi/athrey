const fromEntities = require("../../entity");

exports.Post = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  request,
  store,
  db,
  crypto,
  mailer,
}) => {
  return Object.freeze({
    execute: async () => {
      try {
        const lang = request.lang;
        let entity = await fromEntities.entities.Auth.SendOtp({
          CreateError,
          DataValidator,
          logger,
          lang,
          translate,
          params: { ...request.body },
        }).generate();

        entity = entity.data.entity;

        // generate and store OTP
        const otp = getOTP(6);

        const storeOtpStatus = await store
          .Store({ translate, logger, lang, CreateError })
          .sendOtp({ otp, email: entity.email });

        // send mail with otp
        mailer.methods
          .Send({ CreateError, translate, logger, lang })
          .sendVerifyEmialOtp({
            to: entity.email,
            otp: otp,
          });

        return {
          msg: translate(lang, "password_reset_account_found"),
          data: {},
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error("failed to send otp", error);
        throw new Error(error.message);
      }
    },
  });
};

function getOTP(len, charSet) {
  len = 6 || len;
  charSet = charSet || "0123456789";
  var randomString = "";
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
}
