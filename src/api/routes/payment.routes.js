const express = require('express');
const router = express.Router();

const fromController = require('../controllers').payment;

const middlewares = require("../middlewares");

/*
 * @desc /logs
 */
router.post('/create', middlewares.isLogged, fromController.createPayment);

router.post('/webhook', fromController.webhook);

module.exports = router;
