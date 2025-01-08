const fromSend = require('./send');
// const fromRead = require('./read');

module.exports.methods = {
    Send: fromSend.Send,
    // read: fromRead.read
}