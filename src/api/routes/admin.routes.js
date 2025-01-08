const express = require('express');
const router = express.Router();

const fromController = require('../controllers').admin;
const middlewares = require("../middlewares");

/*
 * @desc /admin
 */
router.get('', middlewares.isLogged, fromController.getAdmins);
// users
router.get('/users', middlewares.isLogged, fromController.fetchAllUsers)

// approved doctor
router.post('/doctor/:doctorUID', middlewares.isLogged, fromController.updateDoctorStatus)


router.get('/:userUID', middlewares.isLogged, fromController.getAdmins);
router.delete('/:userUID', middlewares.isLogged, fromController.deleteAdmin);
router.post('/invite', middlewares.isLogged, fromController.inviteAdmin);
router.post('/signup', fromController.createAdmin);
router.get('/accept/:userID', fromController.checkAdminInvite);
router.post('/accept/:userID', fromController.acceptAdminInvite);

module.exports = router;