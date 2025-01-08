const models = require('../models').models;

exports.DoctorDetails = ({ translate, logger, CreateError, lang }) => {
    return Object.freeze({
        create: async (params) => {
            try {
                const constructedParams = load(params);
                const createDoctor = await models
                    .DoctorDetails
                    .create(constructedParams.updateParams);
                return {
                    msg: `Created doctor details successfully`,
                    data: { doctors: unload(createDoctor.dataValues) }
                }
            } catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    throw new CreateError(translate(lang, 'duplicate_doctor'), 409)
                }
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to create doctor details: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        /*
         * @param [uuid]userUID - uid of the user
         * @param [string]deviceId - doctor id
         * @param [object]params - params to update
         * @returns 
         */
        updateByUserUID: async ({ userUID, params }) => {
            try {
                const constructedParams = load(params);
                const updateDoctor = await models
                    .DoctorDetails
                    .update(constructedParams.updateParams,
                        {
                            where: {
                                user_uid: userUID,
                            }
                        });
                return {
                    msg: `Updated doctor details successfully`,
                    data: {}
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to update doctor details: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        /*
         * @param { uui }userUID - uid of the user
         * @returns [object|null]doctors
         */
        findByUserUID: async ({ userUID }) => {
            try {
                const findDoctor = await models
                    .DoctorDetails
                    .findOne({
                        where: {
                            user_uid: userUID,
                        }
                    });
                console.log(findDoctor)
                return {
                    msg: `Find doctor result`,
                    data: { doctors: findDoctor === null ? null : unload(findDoctor.dataValues) }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find doctor: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        /*
         * @params { number } offset - records to offset,
         * @params { number } limit - records to fetch,
         * @params { string } sortBy - name of the column to sort
         * @params { string } order - 'ASC' | 'DESC'
         * @returns [object|null]doctors
         */
        findAll: async ({ offset, limit, sortBy, order }) => {
            try {
                const sortableColumns = ["created_at", "updated_at"];

                if (limit) {
                    limit = parseInt(limit);
                } else {
                    limit = 100;
                }

                if (offset) {
                    offset = parseInt(offset);
                } else {
                    offset = 0;
                }

                if (sortBy) {
                    sortBy = sortBy;
                } else {
                    sortBy = 'created_at';
                }

                if (order) {
                    order = order.toUpperCase();
                } else {
                    order = 'DESC';
                }

                const findDoctor = await models
                    .DoctorDetails
                    .findAll({
                        offset: offset,
                        limit: limit,
                        order: [
                            [sortBy, order]
                        ]
                    });
                const countDoctors = await models
                    .DoctorDetails
                    .count();

                return {
                    msg: `Find all doctor result`,
                    data: {
                        doctors: findDoctor,
                        offset,
                        limit,
                        sortBy,
                        sortableColumns: sortableColumns,
                        total: countDoctors,
                        order
                    }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find all doctor: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        /*
         * @params {uuid}userUID - uid of the user
         * @returns {number} delete count
         */
        deleteByUserUID: async ({ userUID }) => {
            try {
                const findDoctor = await models
                    .DoctorDetails
                    .destroy({
                        where: {
                            user_uid: userUID,
                        }
                    });
                return {
                    msg: `Delete doctor`,
                    data: { deleted: findDoctor }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to delete doctor: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        }
    })
}


function unload(params) {
    const data = {
        user_uid: params.user_uid,
        specialization: params.specialization,
        biography: params.biography,
        qualification: params.qualification,
        experience: params.experience,
        lanr: params.lanr,
        bsnr: params.bsnr,
        id_front_uid: params.id_front_uid,
        id_back_uid: params.id_back_uid,
        verification_status: params.verification_status,
        verified_by: params.verified_by,
        verified_on: params.verified_on,
        created_at: params.created_at,
        updated_at: params.updated_at,
        id_photo_uid: params.id_photo_uid,
    };
    return data;
}

function load(fields) {
    // param map
    const paramsMap = {
        user_uid: 'user_uid',
        specialization: 'specialization',
        biography: 'biography',
        qualification: 'qualification',
        experience: 'experience',
        lanr: 'lanr',
        bsnr: 'bsnr',
        id_front_uid: 'id_front_uid',
        id_back_uid: 'id_back_uid',
        verification_status: 'verification_status',
        verified_by: 'verified_by',
        verified_on: 'verified_on',
        id_photo_uid: 'id_photo_uid'
    };

    let updateParams = {};

    for (const param in fields) {
        const key = paramsMap[param];
        updateParams[key] = fields[param];
    }

    return { updateParams }
}
