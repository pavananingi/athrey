const fromStore = require('./methods');

const connection = require('./connection');


exports.store = {
    con: connection.client,
    Store: fromStore.Store
};
