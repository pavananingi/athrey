exports.createAdminEntity = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    crypto,
    lang,
    params = {
        firstname,
        lastname,
        email,
        role,
        password,
        verify_password,
        country_code,
        phone
    }
}) => {
    return Object.freeze({
        generate: () => {
            try {
                const validate = DataValidator({ CreateError, lang, translate });

                let entity = {
                    firstname: null,
                    lastname: null,
                    email: null,
                    role: null,
                    password: null,
                    verify_password: null,
                    country_code: params?.country_code,
                    phone: null
                };

                if (params.firstname) {
                    entity.firstname = validate.firstname(params.firstname).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_firstname'));
                }

                if (params.lastname) {
                    entity.lastname = validate.lastname(params.lastname).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_lastname'));
                }

                if (params.email) {
                    entity.email = validate.email(params.email).data.value;
                } else {
                    throw new CreateError(translate(lang, "required_email"));
                }

                if (params.role) {
                    entity.role = validate.role(params.role).data.value;
                } else {
                    throw new CreateError(translate(lang, "required_role"));
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

                if (params.phone) {
                    entity.phone = validate.phone(params.phone).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_phone'));
                }

                return {
                    msg: translate(lang, 'success'),
                    data: { entity }
                }
            } catch (error) {
                logger.error('Failed to create admin entity: %s', error);
                if (error instanceof CreateError) {
                    throw error;
                }
                throw new Error(translate(lang, 'error_unknown'))
            }
        }
    })
}