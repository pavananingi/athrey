const fromRegisterDoctor = require('./register');
const fromFindDoctor = require('./find');
const fromUpdateDoctor = require('./update');
const fromDeleteDoctor = require('./delete');
const fromCreateDocPractice = require('./create-practice');
const fromFindDocPractice = require('./find-practice');
const fromUpdateDocPractice = require('./update-practice');
const fromDeleteDocPractice = require('./delete-practice');
const fromFindDocBank = require('./find-bank');
const fromUpdateDocBank = require('./update-bank');

module.exports = {
    RegisterDoctor: fromRegisterDoctor.RegisterDoctor,
    FindDoctors: fromFindDoctor.FindDoctors,
    UpdateDoctor: fromUpdateDoctor.UpdateDoctor,
    DeleteDoctor: fromDeleteDoctor.DeleteDoctor,
    CreateDoctorPractice: fromCreateDocPractice.CreateDoctorPractice,
    FindDoctorPractice: fromFindDocPractice.FindDoctorPractice,
    UpdateDoctorPractice: fromUpdateDocPractice.UpdateDoctorPractice,
    DeleteDoctorPractice: fromDeleteDocPractice.DeleteDoctorPractice,
    FindDoctorBank: fromFindDocBank.FindDoctorBank,
    UpdateDoctorBank: fromUpdateDocBank.UpdateDoctorBank,
}
