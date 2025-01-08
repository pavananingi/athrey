const express = require("express");
const router = express.Router();

const auhtController = require("../controllers").auth;
const middlewares = require("../middlewares");

/*
 * @desc /auth
 */
router.post("/login", auhtController.login);
router.get("/login", middlewares.isLogged, auhtController.login);
router.post("/otp/send", auhtController.sendOtp);

router.post("/signup", auhtController.postSignup);
router.post("/register", auhtController.postRegister);


router.post("/doctor/:token", auhtController.generatePassword);

router.post(
  "/logout",
  middlewares.verifyRefreshToken,
  auhtController.postlogout
);

router.post(
  "/refresh",
  middlewares.verifyRefreshToken,
  auhtController.postGenerateBearerToken
);

router.post("/resetPassword/:action", auhtController.postPasswordReset);
router.post("/templogin", auhtController.tempLogin);
router.get("/verifyemail/:uid/:date", auhtController.verifyEmail);
module.exports = router;
