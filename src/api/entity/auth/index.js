const fromCreateSignup = require('./create-signup.entity');
const fromCreateRegister = require('./create-register.entity');
const fromLogin = require('./login.entity');
const fromFindAccount = require('./password-find-acc.entity');
const fromVerifyOtp = require('./password-verify-otp.entity');
const fromResetChangePassword = require('./password-change.entity');
const fromResetOldPassword = require('./password-change-old.entity')
const fromSendOtp = require("./send-otp.entiy");
const fromVerifyOtp2 = require("./verify-otp.entity");

exports.AuthEntity = {
    CreateSignup: fromCreateSignup.CreateSignupEntity,
    CreateRegister: fromCreateRegister.CreateRegisterEntity,
    Login: fromLogin.LoginEntity,
    PasswordResetEmailEntity: fromFindAccount.PasswordResetEmailEntity,
    PasswordResetVerifyOTP: fromVerifyOtp.PasswordResetVerifyOTP,
    SendOtp: fromSendOtp.sendOtpEntity,
    PasswordReset: fromResetChangePassword.PasswordReset,
    PasswordResetOldPassword: fromResetOldPassword.PasswordResetOldPassword,
    VerifyOtp: fromVerifyOtp2.VerifyOTP

}