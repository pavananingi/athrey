const express = require('express');
const router = express.Router();

const fromController = require('../controllers').callLogs;

/*
 * @desc /logs
 */
router.get('/doctor/:userUID', fromController.getDoctorCallLogs);



module.exports = router;
