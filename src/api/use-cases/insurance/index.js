const fromCreateInsurance = require('./create');
const fromFindInsurance = require('./find');
const fromDeleteInsurance = require('./delete');
module.exports = {
    Create: fromCreateInsurance,
    Find: fromFindInsurance,
    Delete: fromDeleteInsurance
}