const fromCreateCategory = require('./create-categories.entity');
const fromUpdateCategory = require('./update-category.entity');
const fromCreateTreatment = require('./create-treatment.entity');
const fromUpdateTreatment = require('./update-treatment.entity');
const fromCreateSpecialization = require('./create-specialization.entity');
const fromUpdateSpecialization = require('./update-specialization.entity');

module.exports = {
    CreateCategory: fromCreateCategory,
    UpdateCategory: fromUpdateCategory,
    CreateTreatment: fromCreateTreatment,
    UpdateTreatment: fromUpdateTreatment,
    CreateSpecialization: fromCreateSpecialization,
    UpdateSpecialization: fromUpdateSpecialization
}