const fromEntity = require('../../entity');

/*
 * @desc Register the device under notification devices
 * @params [object]body - object under request.body
 * @returns [object]devices - details of the registered device 
*/
exports.RegisterDevice = ({
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

                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }

                let permission = ac.can(role).createOwn('device');

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const entity = (fromEntity.entities
                    .Device
                    .RegisterDevice({
                        CreateError,
                        DataValidator,
                        logger,
                        translate,
                        lang,
                        params: {
                            ...request.body,
                            user_uid: userUID
                        }
                    }).generate()).data.entity

                const devicesTable = db.methods.NotificationDevice({ translate, logger, CreateError, lang });

                // create device
                const device = (await devicesTable
                    .create({ ...entity }))
                    .data.devices;

                return {
                    msg: translate(lang, 'success'),
                    data: { devices: device }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to register device: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}