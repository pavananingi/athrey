
/*
 * @desc Delete the device under notification devices
 * @returns
*/
exports.DeleteDevice = ({
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
                const deviceId = request.urlParams.deviceId;


                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }

                if (!deviceId) {
                    throw new CreateError(translate(lang, 'required_device_id'))
                }


                let permission = ac.can(role).deleteOwn('device');

                if (queryParams.user_uid) {
                    if (queryParams.user_uid !== userUID) {
                        permission = ac.can(role).deleteAny('device');
                    }
                }

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).deleteAny('device');
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

                const recordsDeleted = (await devicesTable
                    .deleteByDeviceId({
                        userUID: customerUID,
                        deviceId: deviceId
                    })).data.deleted;

                return {
                    msg: translate(lang, 'success'),
                    data: { deleted: recordsDeleted }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to delete devices: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}