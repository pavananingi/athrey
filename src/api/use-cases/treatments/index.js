const fromCreateCategories = require('./categories/create-categories');
const fromUpdateCategory = require('./categories/update-category');
const fromFindCategory = require('./categories/find-categories');
const fromDeleteCategory = require('./categories/delete-categories');
const fromCreateTreatment = require('./treatments/create-treatment');
const fromUpdateTreatment = require('./treatments/update-treatment');
const fromFindTreatment = require('./treatments/find-treatment');
const fromDeleteTreatment = require('./treatments/delete-treatment');
const fromCreateSpecialization = require('./specializations/create-specialization');
const fromUpdateSpecialization = require('./specializations/update-specialization');
const fromFindSpecialization = require('./specializations/find-specialization');
const fromDeleteSpecialization = require('./specializations/delete-specialization');
module.exports = {
    categories: {
        CreateCategories: fromCreateCategories,
        UpdateCategory: fromUpdateCategory,
        FindCategory: fromFindCategory,
        DeleteCategory: fromDeleteCategory
    },
    specializations: {
        CreateSpecialization: fromCreateSpecialization,
        UpdateSpecialization: fromUpdateSpecialization,
        FindSpecialization: fromFindSpecialization,
        DeleteSpecialization: fromDeleteSpecialization
    },
    treatments: {
        CreateTreatment: fromCreateTreatment,
        UpdateTreatment: fromUpdateTreatment,
        FindTreatment: fromFindTreatment,
        DeleteTreatment: fromDeleteTreatment
    }
}