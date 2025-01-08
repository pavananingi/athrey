exports.UpdatePracticeEntity = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    lang,
    params = {
        bsnr: null,
        lanr: null,
        address_line_1: null,
        address_line_2: null,
        city: null,
        state: null,
        postal_code: null,
        country: null,
        name,
        email,
        phone,
        telephone,
        website,
        kbv,
        association,
        registration_no,
        country_code,
    }
}) => {
    return Object.freeze({
        generate: () => {
            try {
                const validate = DataValidator({ CreateError, lang, translate });

                let entity = {
                    bsnr: null,
                    lanr: null,
                    address_line_1: null,
                    address_line_2: null,
                    city: null,
                    state: null,
                    postal_code: null,
                    country: null,
                    name: null,
                    email: null,
                    phone: null,
                    telephone: null,
                    website: null,
                    kbv: null,
                    association: null,
                    registration_no: null,
                    country_code: null,
                };

                if (params.registration_no) {
                    entity.registration_no = params.registration_no;
                } else {
                    delete entity.registration_no;
                }

                if (params.country_code) {
                    entity.country_code = params.country_code;
                } else {
                    delete entity.country_code;
                }

                if (params.bsnr) {
                    entity.bsnr = validate.bsnr(params.bsnr).data.value;
                } else {
                    delete entity.bsnr;
                }
                if (params.lanr) {
                    entity.lanr = validate.lanr(params.lanr).data.value;
                } else {
                    delete entity.lanr;
                }

                if (params.address_line_1) {
                    entity.address_line_1 = validate.address(params.address_line_1).data.value;
                } else {
                    delete entity.address_line_1;
                }

                if (params.address_line_2) {
                    entity.address_line_2 = validate.address(params.address_line_2).data.value;
                } else {
                    delete entity.address_line_2;
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

                if (params.name) {
                    entity.name = validate.practiceName(params.name).data.value;
                } else {
                    delete entity.name;
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

                if (params.telephone) {
                    entity.telephone = validate.telephone(params.telephone).data.value;
                } else {
                    delete entity.telephone;
                }

                if (params.website) {
                    entity.website = validate.website(params.website).data.value;
                } else {
                    delete entity.website;
                }

                if (params.kbv) {
                    entity.kbv = validate.kbv(params.kbv).data.value;
                } else {
                    delete entity.kbv;
                }

                if (params.association) {
                    entity.association = validate.association(params.association).data.value;
                } else {
                    delete entity.association;
                }

                return {
                    msg: translate(lang, 'success'),
                    data: { entity }
                }
            } catch (error) {
                logger.error('Failed to update practice entity: %s', error);
                if (error instanceof CreateError) {
                    throw error;
                }
                throw new Error(translate(lang, 'error_unknown'))
            }
        }
    })
}