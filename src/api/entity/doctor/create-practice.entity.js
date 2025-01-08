exports.CreatePracticeEntity = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    lang,
    params = {
        user_uid,
        bsnr,
        lanr,
        address_line_1,
        address_line_2,
        city,
        state,
        postal_code,
        country,
        name,
        email,
        phone,
        telephone,
        website,
        kbv,
        association,
        country_code,
        registration_no
    }
}) => {
    return Object.freeze({
        generate: () => {
            try {
                const validate = DataValidator({ CreateError, lang, translate });

                let entity = {
                    user_uid: null,
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
                    registration_no: params?.registration_no,
                    country_code: params?.country_code,
                };

                if (params.user_uid) {
                    entity.user_uid = validate.uuid(params.user_uid).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_uid'))
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
                    throw new CreateError(translate(lang, 'required_street'));
                }

                if (params.address_line_2) {
                    entity.address_line_2 = validate.address(params.address_line_2).data.value;
                } else {
                    entity.address_line_2 = null;
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

                if (params.name) {
                    entity.name = validate.practiceName(params.name).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_practice_name'))
                }

                if (params.email) {
                    entity.email = validate.email(params.email).data.value;
                } else {
                    entity.email = null;
                }

                if (params.phone) {
                    entity.phone = validate.phone(params.phone).data.value;
                } else {
                    entity.phone = null;
                }

                if (params.telephone) {
                    entity.telephone = validate.telephone(params.telephone).data.value;
                } else {
                    entity.telephone = null;
                }

                if (params.website) {
                    entity.website = validate.website(params.website).data.value;
                } else {
                    entity.website = null;
                }

                if (params.kbv) {
                    entity.kbv = validate.kbv(params.kbv).data.value;
                } else {
                    entity.kbv = null;
                }

                if (params.association) {
                    entity.association = validate.association(params.association).data.value;
                } else {
                    entity.association = null;
                }

                return {
                    msg: translate(lang, 'success'),
                    data: { entity }
                }
            } catch (error) {
                logger.error('Failed to create practice entity: %s', error);
                if (error instanceof CreateError) {
                    throw error;
                }
                throw new Error(translate(lang, 'error_unknown'))
            }
        }
    })
}