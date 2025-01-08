exports.CreateRegisterEntity = ({
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
        phone,
        role,
        country_code,
        id_cirtificate_uid,
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
                    phone: null,
                    language: 'en',
                    role: null,
                    country_code: params?.country_code,
                    status: "pending",
                    password: null,
                    id_cirtificate_uid: null
                };

                if (params.firstname) {
                    entity.firstname = validate.firstname(params.firstname).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_firstname'));
                }
                if (params.id_cirtificate_uid) {
                    entity.id_cirtificate_uid = validate.uuid(params.id_cirtificate_uid).data.value;
                } else {
                    delete entity.id_cirtificate_uid;
                }
                if (params.lastname) {
                    entity.lastname = validate.lastname(params.lastname).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_lastname'));
                }

                if (params.email) {
                    entity.email = validate.email(params.email).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_email'))
                }

                if (params.phone) {
                    entity.phone = validate.phone(params.phone).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_phone'));
                }

                if (params.role) {
                    entity.role = validate.role(params.role).data.value;
                    if (entity.role !== 'doctor' && entity.role !== 'patient') {
                        throw new CreateError(translate(lang, 'invalid_role_for_signup'))
                    }
                } else {
                    throw new CreateError(translate(lang, 'required_role'))
                }

                entity.password = crypto.b64.decode("TWHDJ&KEDJSLSLL$DJD56e#8963HDJ@").data.value;


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