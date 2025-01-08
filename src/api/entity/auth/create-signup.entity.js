exports.CreateSignupEntity = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    crypto,
    lang,
    params = {
        salute,
        title,
        firstname,
        lastname,
        avatar_url,
        dob,
        email,
        password,
        verify_password,
        phone,
        // language,
        role,
        // address_line_1,
        // address_line_2,
        guardian,
        height,
        weight,
        structure,
        address,
        city,
        state,
        postal_code,
        country,
        telephone,
    }
}) => {
    return Object.freeze({
        generate: () => {
            try {
                const validate = DataValidator({ CreateError, lang, translate });

                let entity = {
                    salute: null,
                    title: null,
                    firstname: null,
                    lastname: null,
                    avatar_url: "default.png",
                    dob: null,
                    email: null,
                    password: null,
                    verify_password: null,
                    phone: null,
                    language: 'de',
                    role: null,
                    address_line_1: null,
                    address_line_2: null,
                    city: null,
                    state: null,
                    postal_code: null,
                    country: null,
                    telephone: null
                };


                if (params.salute) {
                    entity.salute = validate.salute(params.salute).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_salute'));
                }

                if (params.title) {
                    entity.title = validate.title(params.title).data.value;
                } else {
                    entity.title = null;
                }

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

                if (params.dob) {
                    entity.dob = validate.dob(params.dob).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_dob'))
                }

                if (params.email) {
                    entity.email = validate.email(params.email).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_email'))
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

                if (params.language) {
                    entity.language = validate.language(params.language).data.value;
                } else {
                    entity.language = 'de';
                }

                if (params.role) {
                    entity.role = validate.role(params.role).data.value;
                    if (entity.role !== 'doctor' && entity.role !== 'patient') {
                        throw new CreateError(translate(lang, 'invalid_role_for_signup'))
                    }
                } else {
                    throw new CreateError(translate(lang, 'required_role'))
                }
                if (params.guardian) {
                    entity.guardian = validate.address(params.guardian).data.value;
                } else {
                    delete entity.guardian;
                }
                if (params.height) {
                    entity.height = validate.address(params.height).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_height'));
                }
                if (params.weight) {
                    entity.weight = validate.address(params.weight).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_weight'));
                }
                if (params.structure) {
                    entity.structure = validate.address(params.structure).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_structure'));
                }

                if (params.address) {
                    entity.address = validate.address(params.address).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_street'));
                }

                if (params.city) {
                    entity.city = validate.city(params.city).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_city'));
                }
                if (params.state) {
                    entity.state = validate.state(params.state).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_state'));
                }
                if (params.postal_code) {
                    entity.postal_code = validate.postalCode(params.postal_code).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_postal'));
                }
                if (params.country) {
                    entity.country = validate.country(params.country).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_country'));
                }
                if (params.telephone) {
                    entity.telephone = validate.telephone(params.telephone).data.value;
                } else {
                    delete entity.telephone;
                }

                return {
                    msg: translate(lang, 'success'),
                    data: { entity }
                }
            } catch (error) {
                logger.error('Failed to create signup entity: %s', error);
                if (error instanceof CreateError) {
                    throw error;
                }
                throw new Error(translate(lang, 'error_unknown'))
            }
        }
    })
}