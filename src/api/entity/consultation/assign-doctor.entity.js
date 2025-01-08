module.exports = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    lang,
    params = {
        consultation_uid,
        doctor_uid,
        confirmed_schedule,
        duration
    }
}) => {
    return Object.freeze({
        async generate() {
            try {
                const validate = DataValidator({ CreateError, lang, translate });

                let entity = {
                    consultation_uid: null,
                    doctor_uid: null,
                    confirmed_schedule: null,
                    duration: null
                }

                if (params.doctor_uid) {
                    entity.doctor_uid = validate.uuid(params.doctor_uid).data.value;
                } else {
                    throw new CreateError(translate(lang, 'invalid_doctor_uid'));
                }

                if (params.consultation_uid) {
                    entity.consultation_uid = validate.uuid(params.consultation_uid).data.value;
                } else {
                    throw new CreateError(translate(lang, 'invalid_consultation_uid'));
                }

                if (params.confirmed_schedule) {
                    entity.confirmed_schedule = validate.timestamp(params.confirmed_schedule).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_confirmed_schedule'))
                }

                if (params.duration) {
                    entity.duration = validate.duration(params.duration).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_duration'))
                }

                return {
                    msg: 'success',
                    data: { entity }
                }

            } catch (error) {
                logger.error('Failed to create assign doctor to consultation entity: %s', error);
                if (error instanceof CreateError) {
                    throw error;
                }
                throw new Error(translate(lang, 'error_unknown'))
            }
        }
    })
}
