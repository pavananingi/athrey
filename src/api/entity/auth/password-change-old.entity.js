exports.PasswordResetOldPassword = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    crypto,
    lang,
    params = {
        email,
        old_password,
        password,
        verify_password,
    }
}) => {
    return Object.freeze({
        generate: () => {
            try {
                const validate = DataValidator({ CreateError, lang, translate });

                let entity = {
                    email: null,
                    old_password: null,
                    password: null,
                    verify_password: null,
                };

                if (params.email) {
                    entity.email = validate.email(params.email).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_email'))
                }

                if (params.old_password) {
                    const oldPassword = crypto.b64.decode(params.old_password).data.value;
                    entity.old_password = validate.password(oldPassword).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_old_password'))
                }

                if (params.password) {
                    const password = crypto.b64.decode(params.password).data.value;
                    entity.password = validate.password(password).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_password'))
                }

                if (params.verify_password) {
                    const verifyPassword = crypto.b64.decode(params.verify_password).data.value;
                    if (verifyPassword === entity.password) {
                        entity.verify_password = entity.password;
                    } else {
                        throw new CreateError(translate(lang, 'password_mismatch'))
                    }
                } else {
                    throw new CreateError(translate(lang, 'required_verify_password'))
                }

                return {
                    msg: translate(lang, 'success'),
                    data: { entity }
                }
            } catch (error) {
                logger.error('Failed to create password change using old password entity: %s', error);
                if (error instanceof CreateError) {
                    throw error;
                }
                throw new Error(translate(lang, 'error_unknown'))
            }
        }
    })
}