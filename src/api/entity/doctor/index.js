const fromRegisterDoctor = require('./create.entity');
const fromUpdateDoctor = require('./update.entity');
const fromCreatePractice = require('./create-practice.entity');
const fromUpdatePractice = require('./update-practice.entity');
const fromUpdateBank = require('./update-bank.entity');

module.exports = {
    CreateDoctor: fromRegisterDoctor.CreateDoctorEntity,
    UpdateDoctor: fromUpdateDoctor.UpdateDoctorEntity,
    CreateDoctorPractice: fromCreatePractice.CreatePracticeEntity,
    UpdateDoctorPractice: fromUpdatePractice.UpdatePracticeEntity,
    UpdateDoctorBank: fromUpdateBank.UpdateBankEntity
}