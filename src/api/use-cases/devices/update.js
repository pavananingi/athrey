const fromEntity = require('../../entity');

/*
 * @desc Update the device under notification devices
 * @desc Only notification_id and device_name can be updated
 * @params [object]body - object under request.body
 * @returns [object]devices - updated details of the registered device 
*/
exports.UpdateDevice = ({
    CreateError,
    DataValidator,
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
                const deviceId = request.urlParams.deviceId;

                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }

                if (!deviceId) {
                    throw new CreateError(translate(lang, 'required_device_id'))
                }

                let permission = ac.can(role).updateOwn('device');

                if (queryParams.user_uid) {
                    if (queryParams.user_uid !== userUID) {
                        permission = ac.can(role).updateAny('device');
                    }
                }

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).updateAny('device');
                }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                
                // filter body based on the role
                const body = permission.filter(request.body);

                const entity = (fromEntity.entities
                    .Device
                    .UpdateDevice({
                        CreateError,
                        DataValidator,
                        logger,
                        translate,
                        lang,
                        params: {
                            ...body,
                        }
                    }).generate()).data.entity

                const devicesTable = db.methods.NotificationDevice({ translate, logger, CreateError, lang });

                // update device
                let updateUID;
                if (queryParams.user_uid) {
                    updateUID = queryParams.user_uid;
                } else {
                    updateUID = userUID;
                }

                const updateDevice = (await devicesTable
                    .update({ userUID: updateUID, deviceId: deviceId, params: entity }));

                const updatedDevice = (await devicesTable
                    .find({ userUID: updateUID, deviceId: deviceId, }))
                    .data.devices;

                if (updatedDevice === null) {
                    throw new CreateError(translate(lang, 'device_not_found'), 404);
                }

                return {
                    msg: translate(lang, 'success'),
                    data: { devices: updatedDevice }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to update device: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}