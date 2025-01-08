const fromRegisterDevice = require('./register');
const fromUpdateDevice = require('./update');
const fromFindDevice = require('./find');
const fromDeleteDevice = require('./delete');

exports.devicesUseCases = {
    RegisterDevice: fromRegisterDevice.RegisterDevice,
    UpdateDevice: fromUpdateDevice.UpdateDevice,
    FindDevice: fromFindDevice.FindDevice,
    DeleteDevice: fromDeleteDevice.DeleteDevice
}
