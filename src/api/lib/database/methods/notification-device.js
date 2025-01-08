const models = require('../models').models;
const operators = require('../connection').operators;

exports.NotificationDevice = ({ translate, logger, CreateError, lang }) => {
    return Object.freeze({
        create: async (params) => {
            try {
                const constructedParams = load(params);
                const createDevice = await models
                    .NotificationDevice
                    .findOrCreate({
                        where: constructedParams.updateParams
                    });
                return {
                    msg: `Created notification device successfully`,
                    data: { devices: unload(createDevice[0].dataValues) }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to create notification device: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        /*
         * @param [uuid]userUID - uid of the user
         * @param [string]deviceId - device id
         * @param [object]params - params to update
         * @returns 
         */
        update: async ({ userUID, deviceId, params }) => {
            try {
                const constructedParams = load(params);
                const updateDevice = await models
                    .NotificationDevice
                    .update(constructedParams.updateParams,
                        {
                            where: {
                                user_uid: userUID,
                                device_id: deviceId
                            }
                        });
                return {
                    msg: `Updated notification device successfully`,
                    data: {}
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to update notification device: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        /*
         * @param [uuid]userUID - uid of the user
         * @param [string]deviceId - device id
         * @returns [object|null]devices
         */
        find: async ({ userUID, deviceId }) => {
            try {
                const findDevice = await models
                    .NotificationDevice
                    .findOne({
                        where: {
                            user_uid: userUID,
                            device_id: deviceId
                        }
                    });
                return {
                    msg: `Find device result`,
                    data: { devices: findDevice === null ? null : unload(findDevice.dataValues) }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find device: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        /*
         * @param [uuid]userUID - uid of the user
         * @returns [object|null]devices
         */
        findAllByUserUID: async ({ userUID }) => {
            try {
                const findDevice = await models
                    .NotificationDevice
                    .findAll({
                        where: {
                            user_uid: userUID,
                        }
                    });
                return {
                    msg: `Find all device result`,
                    data: { devices: findDevice }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find all device: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        /*
         * @param [uuid]userUIDs - array of user uid
         * @returns [object|null]devices
         */
        findAllByUserUIDs: async ({ userUIDs }) => {
            try {
                const findDevice = await models
                    .NotificationDevice
                    .findAll({
                        where: {
                            user_uid: {
                                [operators.in]: userUIDs
                            },
                        },
                        order: [['created_at', 'DESC']]
                    });
                return {
                    msg: `Find all device result`,
                    data: { devices: findDevice }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find all device: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        /*
         * @param [uuid]userUID - uid of the user
         * @param [array]deviceId - device id
         */
        deleteByDeviceId: async ({ userUID, deviceId }) => {
            try {
                const findDevice = await models
                    .NotificationDevice
                    .destroy({
                        where: {
                            user_uid: userUID,
                            device_id: deviceId
                        }
                    });
                return {
                    msg: `Delete device`,
                    data: { deleted: findDevice }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to delete device: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        }
    })
}


function unload(params) {
    const data = {
        user_uid: params.user_uid,
        device_name: params.device_name,
        device_id: params.device_id,
        notification_id: params.notification_id,
        created_at: params.created_at,
        updated_at: params.updated_at,
    };
    return data;
}

function load(fields) {
    // param map
    const paramsMap = {
        user_uid: 'user_uid',
        device_name: 'device_name',
        device_id: 'device_id',
        notification_id: 'notification_id',
    };

    let updateParams = {};

    for (const param in fields) {
        const key = paramsMap[param];
        updateParams[key] = fields[param];
    }

    return { updateParams }
}
