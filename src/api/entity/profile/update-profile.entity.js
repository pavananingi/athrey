exports.UpdateProfileEntity = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    lang,
    params = {
        salute,
        title,
        firstname,
        lastname,
        avatar_url,
        dob,
        email,
        phone,
        language,
        city,
        state,
        postal_code,
        country,
        first_login,
        telephone,
        address,
        height,
        weight,
        structure,
        guardian
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
                    phone: null,
                    language: 'de',
                    city: null,
                    state: null,
                    postal_code: null,
                    country: null,
                    first_login: false,
                    telephone: null,
                    address: null,
                    height: null,
                    weight: null,
                    structure: null,
                    guardian: null
                };

                if (params.salute) {
                    entity.salute = validate.salute(params.salute).data.value;
                } else {
                    delete entity.salute;
                }

                if (params.title) {
                    entity.title = validate.title(params.title).data.value;
                } else if (params.title === null) {
                    entity.title = null;
                } else if (params.title === '') {
                    entity.title = null;
                } else {
                    delete entity.title;
                }

                if (params.firstname) {
                    entity.firstname = validate.firstname(params.firstname).data.value;
                } else {
                    delete entity.firstname;
                }

                if (params.lastname) {
                    entity.lastname = validate.lastname(params.lastname).data.value;
                } else {
                    delete entity.lastname;
                }

                if (params.dob) {
                    entity.dob = validate.dob(params.dob).data.value;
                } else {
                    delete entity.dob;
                }

                if (params.email) {
                    entity.email = validate.email(params.email).data.value;
                } else {
                    delete entity.email;
                }

                if (params.phone) {
                    entity.phone = validate.phone(params.phone).data.value;
                } else {
                    delete entity.phone;
                }

                if (params.language) {
                    entity.language = validate.language(params.language).data.value;
                } else {
                    delete entity.language;
                }

                if (params.address) {
                    entity.address = validate.address(params.address).data.value;
                } else {
                    delete entity.address;
                }

                if (params.height) {
                    entity.height = params.height;
                } else {
                    delete entity.height;
                }
                if (params.weight) {
                    entity.weight = params.weight
                } else {
                    delete entity.weight;
                }
                if (params.structure) {
                    entity.structure = params.structure
                } else {
                    delete entity.structure;
                }

                if (params.guardian) {
                    entity.guardian = params.guardian
                } else {
                    delete entity.guardian;
                }

                if (params.city) {
                    entity.city = validate.city(params.city).data.value;
                } else {
                    delete entity.city;
                }
                if (params.state) {
                    entity.state = validate.state(params.state).data.value;
                } else {
                    delete entity.state;
                }
                if (params.postal_code) {
                    entity.postal_code = validate.postalCode(params.postal_code).data.value;
                } else {
                    delete entity.postal_code;
                }
                if (params.country) {
                    entity.country = validate.country(params.country).data.value;
                } else {
                    delete entity.country;
                }

                if (params.first_login === false) {
                    entity.first_login = validate.boolean(params.first_login).data.value;
                } else {
                    delete entity.first_login;
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