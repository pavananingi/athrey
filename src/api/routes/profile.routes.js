const express = require('express');
const router = express.Router();

const fromController = require('../controllers').profile;


/*
 * @desc /profile
 */
router.get('', fromController.getProfile);
router.get('/:uid', fromController.getProfile);

router.patch('', fromController.updateProfile);
router.patch('/:uid', fromController.updateProfile);


module.exports = router;
