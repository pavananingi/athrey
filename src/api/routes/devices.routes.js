const express = require('express');
const router = express.Router();

const fromController = require('../controllers').devices;

/*
 * @desc /devices
 */
router.get('', fromController.getDevices);
router.post('', fromController.createDevices);
router.patch('/:deviceId', fromController.updateDevices);
router.delete('/:deviceId', fromController.deleteDevices);



module.exports = router;