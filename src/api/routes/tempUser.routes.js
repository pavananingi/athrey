const express = require("express");
const router = express.Router();

const tempUserController = require("../controllers").tempUser;

/*
 * @desc /auth
 */
router.post("/tempusersignup", tempUserController.postCreateTempUser);
module.exports = router;
