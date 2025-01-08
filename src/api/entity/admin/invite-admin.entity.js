exports.InviteAdminEntity = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    lang,
    params = {
        salute,
        firstname,
        lastname,
        email,
        role,
    }
}) => {
    return Object.freeze({
        generate: () => {
            try {
                const validate = DataValidator({ CreateError, lang, translate });

                let entity = {
                    salute: null,
                    firstname: null,
                    lastname: null,
                    email: null,
                    role: null,
                };

                if (params.salute) {
                    entity.salute = validate.salute(params.salute).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_salute'));
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