const fromCreate = require('./create');
const fromFind = require('./find');
const fromDelete = require('./delete');
const fromUpdate = require('./update');

module.exports = {
    Create: fromCreate,
    Find: fromFind,
    Delete: fromDelete,
    Update: fromUpdate
}