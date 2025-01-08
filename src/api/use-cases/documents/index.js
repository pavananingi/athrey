const fromCreatePatientDocuments = require('./create-patient-doc');
const fromGetPatientsDocumentsList = require('./get-patient-doc');
const fromDeletePatientDocuments = require('./delete-patient-doc');
const fromGetPatientDocument = require('./download-patient-doc');
const fromUpdateUserDocument = require('./update-doc');
const fromUploadUserDocument = require('./upload-doc');
const fromUploadOpenDocument = require('./upload-open-doc');

module.exports = {
    CreatePatientDocuments: fromCreatePatientDocuments,
    GetPatientDocumentsList: fromGetPatientsDocumentsList,
    DeletePatientDocuments: fromDeletePatientDocuments,
    GetPatientDocument: fromGetPatientDocument,
    UpdateDocument: fromUpdateUserDocument,
    UploadDocuments: fromUploadUserDocument,
    UploadOpenDocuments: fromUploadOpenDocument,
}
