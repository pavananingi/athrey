const express = require('express');
const router = express.Router();

const fromController = require('../controllers').doctor;

/*
 * @desc /doctor
 */
router.get('', fromController.getDoctors);
router.get('/:userUID', fromController.getDoctors);

router.post('', fromController.createDoctor);
router.post('/:userUID', fromController.createDoctor);

router.patch('', fromController.updateDoctors);
router.patch('/:userUID', fromController.updateDoctors);

router.delete('', fromController.deleteDoctors);
router.delete('/:userUID', fromController.deleteDoctors);

router.get('/:userUID/practice', fromController.getDoctorPractice);
router.post('/:userUID/practice', fromController.createDoctorPractice);
router.patch('/:userUID/practice', fromController.updateDoctorPractice);
router.delete('/:userUID/practice', fromController.deleteDoctorPractice);

router.get('/:userUID/bank', fromController.getDoctorBank);
router.patch('/:userUID/bank', fromController.updateDoctorBank);

module.exports = router;
