exports.UpdateDeviceEntity = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    lang,
    params = {
        device_name,
        notification_id,
    }
}) => {
    return Object.freeze({
        generate: () => {
            try {
                const validate = DataValidator({ CreateError, lang, translate });

                let entity = {
                    device_name: null,
                    notification_id: null,
                };

                if (params.device_name) {
                    entity.device_name = String(params.device_name);
                } else {
                    entity.device_name = null;
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
                logger.error('Failed to create registered device update entity: %s', error);
                if (error instanceof CreateError) {
                    throw error;
                }
                throw new Error(translate(lang, 'error_unknown'))
            }
        }
    })
}