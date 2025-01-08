const express = require('express');
const router = express.Router();

const fromController = require('../controllers').insurance;

/*
 * @desc /insurances
 */
router.get('', fromController.getInsurances);
router.post('', fromController.createInsurance);
// router.patch('/:insuranceUID', fromController.updateDevices);
router.delete('/:insuranceUID', fromController.deleteInsurance);



module.exports = router;
