const express = require('express');
const router = express.Router();

const controller = require('../controllers').token;
const middlewares = require('../middlewares');



/*
 * @desc /token
 */
router.get('/login/:requestedUserUID', controller.createToken);


module.exports = router;
