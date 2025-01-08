var atob = require('atob');

exports.decode = (b64) => {
    return { msg: 'success', data: { value: atob(b64) } };
}