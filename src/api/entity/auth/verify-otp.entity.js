exports.VerifyOTP = ({
    CreateError,
    DataValidator,
    logger,
    lang,
    translate,
    params = {
        email,
        otp
    } }) => {
    return Object.freeze({
        generate() {
            try {

                const validate = DataValidator({ CreateError, lang, translate });

                let entity = {
                    email: null,
                    otp: null
                };

                if (params.email) {
                    entity.email = validate.email(params.email).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_email'));
                }

                if (params.otp) {
                    entity.otp = validate.otpValidator(params.otp).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_otp'));
                }

                return {
                    msg: translate(lang, 'success'),
                    data: {
                        entity
                    }
                };
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to construct OTP verify entity', error);
                throw new Error(translate(lang, 'error_unknown'));
            }
        }
    })
}