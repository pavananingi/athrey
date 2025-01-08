const doctor = require("../doctor");

module.exports = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    lang,
    params = {
        new_schedule,
        duration
    },
    role
}) => {
    return Object.freeze({
        async generate() {
            try {
                const validate = DataValidator({ CreateError, lang, translate });

                let entityPatient = {
                    preferred_schedule: null,
                    duration: null
                }
                let entityDoctor = {
                    confirmed_schedule: null,
                    duration: null
                }

                if (params.new_schedule) {
                    entityPatient.preferred_schedule = validate.timestamp(params.new_schedule).data.value;
                    if (role == 'doctor') {
                        entityDoctor.confirmed_schedule = validate.timestamp(params.new_schedule).data.value;
                    }
                } else {
                    throw new CreateError(translate(lang, 'required_confirmed_schedule'))
                }

                if (params.duration) {
                    entityPatient.duration = validate.duration(params.duration).data.value;
                    entityDoctor.duration = validate.duration(params.duration).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_duration'))
                }

                return {
                    msg: 'success',
                    data: { entityPatient, entityDoctor }
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
