const fromCreateCustomer = require('./create-customer');
const fromCreateSubscription = require('./create-subscription');
const fromCreatePaymentMethod = require('./create-payment-method');
const fromUpdateSubPaymentMethod = require('./update-subscription-payment-method');

module.exports = {
    creatCustomer: fromCreateCustomer,
    createSubscription: fromCreateSubscription,
    createPaymentMethod: fromCreatePaymentMethod,
    updateSubPaymentMethod: fromUpdateSubPaymentMethod
}