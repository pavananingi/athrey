const express = require('express');
const router = express.Router();

const fromController = require('../controllers').documents;
const middlewares = require("../middlewares");

const translate = require('../../i18n/msg');
const { CreateError } = require('../../error/dp-error');

const multer = require("multer");
const path = require('path')

const multerStorage = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname + "/../use-cases/documents/temp-documents"));
        },
        filename: (req, file, cb) => {
            cb(null, new Date().getTime() + '_' + req.uid + '_' + file.originalname);
        }
    }),
    limits: { fileSize: 52428800 }, // 50 MB
    fileFilter: (req, file, cb) => {
        const formates = ['png', 'bmp', 'jpg', 'jpeg', 'txt', 'ppt', 'pptx', 'doc', 'docx', 'pdf', 'xls', 'xlsx', 'mp4', '3gp', 'mpeg4', 'mov', 'mkv', 'avi'];
        if (formates.includes(file?.mimetype?.split('/')[1])) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new CreateError(translate(req.lang, 'wrong_file_format'), 400));
        }
    }
})

router.post('/upload', middlewares.isLogged, multerStorage.single("doc"), fromController.uploadDocuments);

router.post('/upload/open', multerStorage.single("doc"), fromController.uploadOpenDocuments);

router.post('', middlewares.isLogged, fromController.postPatientDocuments);

router.post('/:userUID', middlewares.isLogged, fromController.postPatientDocuments);

router.get('/:userUID', middlewares.isLogged, fromController.getPatientDocumentsList);

router.get('/:userUID/:documentUID', middlewares.isLogged, fromController.getPatientDocument);

router.patch('/:userUID/:documentUID', middlewares.isLogged, fromController.updatePatientDocument);

router.delete('/:userUID/:documentUID', middlewares.isLogged, fromController.deletePaitentDocument);



module.exports = router;
