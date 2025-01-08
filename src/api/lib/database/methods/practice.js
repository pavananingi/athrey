const models = require('../models').models;

exports.PracticeDetails = ({ translate, logger, CreateError, lang }) => {
    return Object.freeze({
        create: async (params) => {
            try {
                const constructedParams = load(params);
                const createPractice = await models
                    .PracticeDetails
                    .create(constructedParams.updateParams);
                return {
                    msg: `Created doctor practice details successfully`,
                    data: { practice: unload(createPractice.dataValues) }
                }
            } catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    throw new CreateError(translate(lang, 'duplicate_doctor'), 409)
                }
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to create doctor practice details: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        /*
         * @param [uuid]userUID - uid of the user
         * @param [object]params - params to update
         * @returns 
         */
        updateByUserUID: async ({ userUID, params }) => {
            try {
                const constructedParams = load(params);
                const updatePractice = await models
                    .PracticeDetails
                    .update(constructedParams.updateParams,
                        {
                            where: {
                                user_uid: userUID,
                            }
                        });
                return {
                    msg: `Updated doctor practice details successfully`,
                    data: {}
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to update doctor practice details: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        /*
         * @param { uui }userUID - uid of the user
         * @returns [object|null]practice
         */
        findByUserUID: async ({ userUID }) => {
            try {
                const findPractice = await models
                    .PracticeDetails
                    .findOne({
                        where: {
                            user_uid: userUID,
                        }
                    });
                return {
                    msg: `Find doctor practice result`,
                    data: { practice: findPractice === null ? null : unload(findPractice.dataValues) }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find doctor practice: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        /*
         * @params {uuid}userUID - uid of the user
         * @returns {number} delete count
         */
        deleteByUserUID: async ({ userUID }) => {
            try {
                const findPractice = await models
                    .PracticeDetails
                    .destroy({
                        where: {
                            user_uid: userUID,
                        }
                    });
                return {
                    msg: `Delete doctor practice`,
                    data: { deleted: findPractice }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to delete doctor practice: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        }
    })
}


function unload(params) {
    const data = {
        id: params.id,
        user_uid: params.user_uid,
        address_line_1: params.address_line_1,
        address_line_2: params.address_line_2,
        city: params.city,
        postal_code: params.postal_code,
        country: params.country,
        state: params.state,
        bsnr: params.bsnr,
        lanr: params.lanr,
        name: params.name,
        email: params.email,
        phone: params.phone,
        telephone: params.telephone,
        website: params.website,
        kbv: params.kbv,
        association: params.association,
        country_code: params.country_code,
        registration_no: params.registration_no,
        created_at: params.created_at,
        updated_at: params.updated_at,
    };
    return data;
}

function load(fields) {
    // param map
    const paramsMap = {
        user_uid: 'user_uid',
        address_line_1: 'address_line_1',
        address_line_2: 'address_line_2',
        city: 'city',
        postal_code: 'postal_code',
        country: 'country',
        state: 'state',
        bsnr: 'bsnr',
        lanr: 'lanr',
        name: 'name',
        email: 'email',
        phone: 'phone',
        telephone: 'telephone',
        website: 'website',
        kbv: 'kbv',
        association: 'association',
        country_code: 'country_code',
        registration_no: 'registration_no'
    };

    let updateParams = {};

    for (const param in fields) {
        const key = paramsMap[param];
        updateParams[key] = fields[param];
    }

    return { updateParams }
}


