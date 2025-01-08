const express = require('express');
const router = express.Router();

const fromController = require('../controllers').appPlans;

const middlewares = require("../middlewares");

/*
 * @desc /logs
 */
router.post('/', fromController.createPlans);

router.get('/', middlewares.isLogged, fromController.getPlans);

router.delete('/:plan_id', fromController.deletePlan);

module.exports = router;
