const fromCreatePayment = require("./create-payment");

exports.paymentUseCases = {
  createPayment: fromCreatePayment.createPayment,
};
