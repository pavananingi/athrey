const fromConnection = require('./connection');
const fromCustomer = require('./customer');
const fromInvoice = require('./invoice');
const fromInvoiceItems = require('./invoice-items');
const fromSubscription = require('./subscription');
const fromPaymentMethods = require('./payment-method');
const fromVerifyMethod = require('./verify');

module.exports = {
    connection: fromConnection,
    methods: {
        Customer: fromCustomer,
        Subscription: fromSubscription,
        PaymentMethod: fromPaymentMethods,
        VerifyMethod: fromVerifyMethod,
        Invoice: fromInvoice,
        InvoiceItems: fromInvoiceItems
    }
}


// Creating webhook secrete key
// const webhookCreate = async () => {
//     const webhookEndpoint = await fromConnection.webhookEndpoints.create({
//         url: '',
//         enabled_events: [
//             'invoice.paid',
//         ],
//     });
//     console.log(webhookEndpoint);
// }

// webhookCreate();


// Create Tax Rate
// const taxRate = async () => {
//     const taxRate = await fromConnection.taxRates.create({
//         display_name: 'MWST',
//         description: 'VAT Germany',
//         jurisdiction: 'DE',
//         percentage: 19,
//         inclusive: false,
//     });
//     console.log(taxRate)
// }

// taxRate();