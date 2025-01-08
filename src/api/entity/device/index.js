const fromRegister = require('./register.entity');
const fromUpdate = require('./update.entity');

exports.DeviceEntity = {
    RegisterDevice: fromRegister.RegisterDeviceEntity,
    UpdateDevice: fromUpdate.UpdateDeviceEntity,
}