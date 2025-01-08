
/*
 * @desc Find the device under notification devices
 * @returns [array]devices - updated details of the registered device 
*/
exports.FindDevice = ({
    CreateError,
    logger,
    translate,
    request,
    db,
    ac,
}) => {
    return Object.freeze({
        execute: async () => {
            try {

                const lang = request.lang;
                const userUID = request.locals.uid;
                const role = request.locals.role;
                const queryParams = request.queryParams;

                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }

                let permission = ac.can(role).readOwn('device');

                if (queryParams.user_uid) {
                    if (queryParams.user_uid !== userUID) {
                        permission = ac.can(role).readAny('device');
                    }
                }

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).readAny('device');
                }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const devicesTable = db.methods.NotificationDevice({ translate, logger, CreateError, lang });

                // update device
                let customerUID;
                if (queryParams.user_uid) {
                    customerUID = queryParams.user_uid;
                } else {
                    customerUID = userUID;
                }


                let devicesList = [];
                if (queryParams.device_id) {
                    devicesList = (await devicesTable
                        .find({ userUID: customerUID, deviceId: queryParams.device_id }))
                        .data.devices;

                    if (devicesList === null) {
                        throw new CreateError(translate(lang, 'device_not_found'), 404)
                    } else {
                        devicesList = [devicesList];
                    }
                } else {
                    devicesList = (await devicesTable
                        .findAllByUserUID({ userUID: customerUID }))
                        .data.devices;
                }



                return {
                    msg: translate(lang, 'success'),
                    data: { devices: devicesList }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to find devices: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}