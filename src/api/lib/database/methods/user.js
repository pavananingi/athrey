const models = require('../models').models;
const Sequelize = require("sequelize");

exports.User = ({ translate, logger, CreateError, lang }) => {
    const rolesAttributes = [
        ['user_uid', 'user_uid'],
        ['admin', 'admin'],
        ['superadmin', 'superadmin'],
        ['doctor', 'doctor'],
        ['patient', 'patient'],
        ['staff', 'staff'],
    ];
    return Object.freeze({
        create: async (params) => {
            try {
                const constructedParams = load(params);
                const createUser = await models
                    .User
                    .create(constructedParams.updateParams);
                return {
                    msg: `Created user successfully`,
                    data: { users: unload(createUser, { includeAll: false }) }
                }
            } catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    throw new CreateError(translate(lang, 'duplicate_user'), 409)
                }
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to create users: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        findByEmail: async ({ email, includeAll }) => {
            try {
                email = email.toLowerCase();
                const findUser = await models
                    .User
                    .findOne({
                        include: [{
                            model: models.Role,
                            as: 'roles',
                            required: false,
                            attributes: rolesAttributes
                        }, {
                            model: models.Subscriptions,
                            as: 'subscriptions',
                            required: false,
                        }, {
                            model: models.PaymentMethods,
                            as: 'paymentMethods',
                            required: false,
                        }],
                        where: { email }
                    });
                return {
                    msg: `Find user result`,
                    data: { users: findUser === null ? null : unload(findUser, { includeAll }) }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find users by email: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        findByUID: async ({ uid, includeAll }) => {
            try {
                const findUser = await models
                    .User
                    .findOne({
                        include: [{
                            model: models.Role,
                            as: 'roles',
                            required: false,
                            attributes: rolesAttributes
                        }, {
                            model: models.Subscriptions,
                            as: 'subscriptions',
                            required: false,
                        }, {
                            model: models.PaymentMethods,
                            as: 'paymentMethods',
                            required: false,
                        }],
                        where: { uid }
                    });
                return {
                    msg: `Find user result`,
                    data: { users: findUser === null ? null : unload(findUser, { includeAll }) }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find users by uid: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        updateByEmail: async ({ email, params }) => {
            try {
                email = email.toLowerCase();
                const constructedParams = load(params);
                const updateUser = await models
                    .User
                    .update(constructedParams.updateParams,
                        {
                            where: { email: email }
                        }
                    );

                return {
                    msg: `Updated user details`,
                    data: {}
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to udpate user details: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        updateByUID: async ({ uid, params, fromLog = false }) => {
            try {
                const constructedParams = load(params);
                if (fromLog) {
                    constructedParams.updateParams = {
                        ...constructedParams.updateParams,

                        payable_call_duration: Sequelize.literal(`payable_call_duration + ${constructedParams.updateParams.payable_call_duration}`),

                        total_call_duration: Sequelize.literal(`total_call_duration + ${constructedParams.updateParams.total_call_duration}`)
                    }
                }

                const updateUser = await models
                    .User
                    .update(constructedParams.updateParams,
                        {
                            where: { uid: uid }
                        }
                    );

                return {
                    msg: `Updated user details`,
                    data: {}
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to udpate user details: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        updatePasswordByEmail: async ({ email, password }) => {
            try {
                email = email.toLowerCase();
                const updateUser = await models
                    .User
                    .update(
                        {
                            password: password
                        },
                        {
                            where: { email: email }
                        }
                    );

                return {
                    msg: `Updated user details`,
                    data: {}
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to udpate user details: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        findAllDoctors: async () => {
            try {
                const findUsers = await models
                    .User
                    .findAll({
                        include: [{
                            model: models.Role,
                            as: 'roles',
                            required: true,
                            attributes: rolesAttributes,
                            where: {
                                doctor: true
                            }
                        }]
                    });
                return {
                    msg: `Find all doctors user result`,
                    data: { users: findUsers }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find all doctor users: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        updateStatusByUID: async ({ uid, status = "approved" }) => {
            try {
                const updateUser = await models
                    .User
                    .update({
                        status: status
                    },
                        {
                            where: { uid: uid }
                        }
                    );

                return {
                    msg: `Updated user details`,
                    data: {}
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to udpate user details: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        findAllUsers: async ({ status = "approved", doctor = false, patient = true }) => {
            try {
                console.log("status...", status)
                const findUsers = await models
                    .User
                    .findAll({
                        attributes: { exclude: ['password'] },
                        include: [{
                            model: models.Role,
                            as: 'roles',
                            required: true,
                            attributes: rolesAttributes,
                            where: {
                                doctor: doctor,
                                patient: patient
                            }
                        }],
                        where: {
                            status: status,
                        }
                    });

                return {
                    msg: `Find all doctors user result`,
                    data: { users: findUsers }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find all doctor users: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        findAllPatients: async () => {
            try {
                const findUsers = await models
                    .User
                    .findAll({
                        include: [{
                            model: models.Role,
                            as: 'roles',
                            required: true,
                            attributes: rolesAttributes,
                            where: {
                                patient: true
                            }
                        }]
                    });
                return {
                    msg: `Find all patients user result`,
                    data: { users: findUsers }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find all patient users: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        }
    })
}


function unload(params, { includeAll = false }) {
    const data = {
        id: params.id,
        uid: params.uid,
        salute: params.salute,
        title: params.title,
        firstname: params.firstname,
        lastname: params.lastname,
        avatar_url: params.avatar_url,
        dob: params.dob,
        email: params.email,
        country_code: params.country_code,
        phone: params.phone,
        customer_id: params.customer_id,
        is_active: params.is_active,
        force_reset_password: params.force_reset_password,
        email_verified: params.email_verified,
        phone_verified: params.phone_verified,
        // address_line_1: params.address_line_1,
        // address_line_2: params.address_line_2,
        city: params.city,
        postal_code: params.postal_code,
        country: params.country,
        state: params.state,
        // lanugage: params.lanugage,
        guardian: params.guardian,
        height: params.height,
        weight: params.weight,
        structure: params.structure,
        address: params.address,
        invalid_attempts: params.invalid_attempts,
        first_login: params.first_login,
        telephone: params.telephone,
        roles: params.roles,
        subscriptions: params.subscriptions,
        paymentMethods: params.paymentMethods,
        total_call_duration: params.total_call_duration,
        payable_call_duration: params.payable_call_duration,
        created_at: params.created_at,
        updated_at: params.updated_at,
        status: params.status,
        id_cirtificate_uid: params.id_cirtificate_uid
    };

    if (includeAll) {
        data.password = params.password
    }
    return data;
}

function load(fields) {
    // param map
    const paramsMap = {
        salute: 'salute',
        title: 'title',
        firstname: 'firstname',
        lastname: 'lastname',
        avatar_url: 'avatar_url',
        dob: 'dob',
        email: 'email',
        password: 'password',
        country_code: 'country_code',
        phone: 'phone',
        customer_id: 'customer_id',
        is_active: 'is_active',
        force_reset_password: 'force_reset_password',
        email_verified: 'email_verified',
        phone_verified: 'phone_verified',
        // address_line_1: 'address_line_1',
        // address_line_2: 'address_line_2',
        city: 'city',
        country: 'country',
        state: 'state',
        // lanugage: 'lanugage',
        postal_code: 'postal_code',
        invalid_attempts: 'invalid_attempts',
        first_login: 'first_login',
        telephone: 'telephone',
        payable_call_duration: 'payable_call_duration',
        total_call_duration: 'total_call_duration',
        guardian: "guardian",
        height: "height",
        weight: "weight",
        structure: "structure",
        address: "address",
        status: "status",
        id_cirtificate_uid: "id_cirtificate_uid"
    };

    let updateParams = {};

    for (const param in fields) {
        const key = paramsMap[param];
        updateParams[key] = fields[param];
    }

    return { updateParams }
}
