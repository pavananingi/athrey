const models = require('../models').models;

exports.Role = ({ translate, logger, CreateError, lang }) => {
    return Object.freeze({
        create: async (params) => {
            try {
                const constructedParams = load(params);
                const createRole = await models
                    .Role
                    .create(constructedParams.updateParams);
                return {
                    msg: `Created role successfully`,
                    data: { roles: unload(createRole.dataValues) }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to create role: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        findByEmail: async ({ email, includeAll }) => {
            try {
                email = email.toLowerCase();
                const findRole = await models
                    .Role
                    .findOne({
                        where: { email }
                    });
                return {
                    msg: `Find role result`,
                    data: { roles: findRole === null ? null : unload(findRole.dataValues) }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find role: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        }
    })
}


function unload(params) {
    const data = {
        user_uid: params.user_uid,
        admin: params.admin,
        superadmin: params.superadmin,
        doctor: params.doctor,
        patient: params.patient,
        staff: params.staff,
        created_at: params.created_at,
        updated_at: params.updated_at,
    };
    return data;
}

function load(fields) {
    // param map
    const paramsMap = {
        user_uid: 'user_uid',
        admin: 'admin',
        superadmin: 'superadmin',
        doctor: 'doctor',
        patient: 'patient',
        staff: 'staff',
    };

    let updateParams = {};

    for (const param in fields) {
        const key = paramsMap[param];
        updateParams[key] = fields[param];
    }

    return { updateParams }
}
