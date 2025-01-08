exports.RegisterDeviceEntity = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    lang,
    params = {
        user_uid,
        device_name,
        device_id,
        notification_id,
    }
}) => {
    return Object.freeze({
        generate: () => {
            try {
                const validate = DataValidator({ CreateError, lang, translate });

                let entity = {
                    user_uid: null,
                    device_name: null,
                    device_id: null,
                    notification_id: null,
                };

                if (params.user_uid) {
                    entity.user_uid = validate.uuid(params.user_uid).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_uid'))
                }

                if (params.device_name) {
                    entity.device_name = String(params.device_name);
                } else {
                    entity.device_name = null;
                }

                if (params.device_id) {
                    entity.device_id = String(params.device_id);
                } else {
                    throw new CreateError(translate(lang, 'required_device_id'))
                }

                if (params.notification_id) {
                    entity.notification_id = String(params.notification_id);
                } else {
                    throw new CreateError(translate(lang, 'required_notification_id'))
                }

                return {
                    msg: translate(lang, 'success'),
                    data: { entity }
                }
            } catch (error) {
                logger.error('Failed to create register device entity: %s', error);
                if (error instanceof CreateError) {
                    throw error;
                }
                throw new Error(translate(lang, 'error_unknown'))
            }
        }
    })
}