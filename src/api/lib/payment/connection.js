
const stripeConfig = require('../../../config/stripe.config.json');
const stripeKey = stripeConfig[process.env.NODE_ENV].privateKey;

module.exports = require('stripe')(stripeKey);
