const fromPushNotification = require('./push');
const fromConnection = require('./connection');

module.exports = {
    connection: fromConnection.connection,
    push: fromPushNotification
}