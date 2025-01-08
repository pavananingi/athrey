const fromLogin = require("./login");
const fromRegister = require("./register");
const fromSignup = require("./signup");
const fromLogout = require("./logout");
const fromGenBearerToken = require("./gen-bearer-token");
const fromPasswordReset = require("./password-reset");
const fromTempLogin = require("./tempLogin");
const fromVerifyEmail = require("./verifyEmail");
const fromGeneratePassword = require("./generate-password");
const fromSendOtp = require("./send-otp");

exports.authUseCases = {
  Login: fromLogin.Login,
  Signup: fromSignup.Signup,
  Register: fromRegister.Register,
  Logout: fromLogout.Logout,
  GenBearerToken: fromGenBearerToken.GenBearerToken,
  PasswordReset: fromPasswordReset.PasswordReset,
  TempLogin: fromTempLogin.tempLogin,
  VerifyEmail: fromVerifyEmail.VerifyEmail,
  GeneratePassword: fromGeneratePassword.GeneratePassword,
  SendOtp: fromSendOtp.Post,
};
