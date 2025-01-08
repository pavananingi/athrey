const express = require('express');
const router = express.Router();

const fromController = require('../controllers').medicalRates;

/*
 * @desc /devices
 */
router.get('', fromController.getMedicalRates);
router.post('', fromController.createMedicalRate);
router.patch('/:id', fromController.updateMedicalRate);
router.delete('/:id', fromController.deleteMedicalRate);



module.exports = router;
