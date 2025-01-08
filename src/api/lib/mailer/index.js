const fromConnectin = require('./connection');
const fromMethods = require('./methods');

module.exports.mailer = {
    connection: fromConnectin.connection,
    methods: fromMethods.methods
}