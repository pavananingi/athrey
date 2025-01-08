const express = require('express');
const router = express.Router();

const fromController = require('../controllers').treatments;


/*
 * @desc /categories
 */


// treatments
router.get('/treatments', fromController.findTreatment);
router.get('/treatments/:treatmentId', fromController.findTreatment);
router.delete('/treatments/:treatmentId', fromController.deleteTreatment);

// specializations
router.get('/specializations', fromController.findSpecialization);
router.get('/specializations/:uid', fromController.findSpecialization);
router.post('/specializations', fromController.createSpecialization);
router.patch('/specializations/:uid', fromController.updateSpecialization);
router.delete('/specializations/:uid', fromController.deleteSpecialization);

// categories
router.get('', fromController.findTreatmentCategory);
router.get('/:uid', fromController.findTreatmentCategory);
router.post('', fromController.createTreatmentCategory);
router.patch('/:uid', fromController.updateTreatmentCategory);
router.delete('/:uid', fromController.deleteTreatmentCategory);


// treatments
router.post('/:uid/treatments', fromController.createTreatment);
router.patch('/:uid/treatments/:treatmentId', fromController.updateTreatment);




module.exports = router;
