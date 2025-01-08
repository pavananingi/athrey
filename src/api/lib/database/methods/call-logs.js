const models = require('../models').models;
const dbCon = require('../connection').db;
const operators = require('../connection').operators;


module.exports = ({ translate, logger, CreateError, lang }) => {
    return Object.freeze({
        create: async (params) => {
            try {
                const constructedParams = load(params);
                const create = await models
                    .CallLogs
                    .create(constructedParams.updateParams);
                return {
                    msg: `ok`,
                    data: { logs: unload(create) }
                }
            } catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    throw new CreateError(translate(lang, 'duplicate_call_log'), 409)
                }
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to create call log: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        updateByID: async ({ id, params }) => {
            try {
                const constructedParams = load(params);
                const update = await models
                    .CallLogs
                    .update(constructedParams.updateParams,
                        {
                            where: {
                                id: id
                            }
                        });
                return {
                    msg: `Updated call log details successfully`,
                    data: {}
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to update call log details: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        findByConsUID: async ({ consultationUID }) => {
            try {
                const find = await models
                    .CallLogs
                    .findAll({
                        where: {
                            consultation_uid: consultationUID
                        }
                    });
                return {
                    msg: `ok`,
                    data: { logs: find }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find call log details: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
        findByUserUID: async ({ userUID, startDate, endDate }) => {
            try {
                let whereOptions = generateDateFilter({ startDate, endDate });

                const find = await models
                    .CallLogs
                    .findAll({
                        include: [
                            {
                                model: models.ConsultationDoctors,
                                as: 'logs',
                                required: false,
                                attributes: [
                                    // ['doctor_uid', 'doctor_uid']
                                ],
                                where: {
                                    doctor_uid: userUID
                                },
                                right: true
                            }
                        ],
                        where: {
                            ...whereOptions
                        },
                        order: [
                            ['start_time', 'ASC']
                        ],
                    });

                const sum = await models
                    .CallLogs
                    .sum('Call_logs.duration', {
                        include: [
                            {
                                model: models.ConsultationDoctors,
                                as: 'logs',
                                required: false,
                                attributes: [
                                    // ['doctor_uid', 'doctor_uid']
                                ],
                                where: {
                                    doctor_uid: userUID
                                },
                                right: true
                            }
                        ],
                        where: {
                            ...whereOptions
                        }
                    });

                return {
                    msg: `ok`,
                    data: {
                        logs: find,
                        totalDuration: sum
                    }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to find call log details: %s %s', error.message, error);
                throw Error(translate(lang, 'unknown_error_contact_support'));
            }
        },
    })
}


function unload(params) {
    const data = {
        id: params.id,
        consultation_uid: params.consultation_uid,
        doctor_name: params.doctor_name,
        patient_name: params.patient_name,
        duration: params.duration,
        start_time: params.start_time,
        end_time: params.end_time,
        conversation_id: params.conversation_id,
        media_type: params.media_type,
        invite_type: params.invite_type,
        disconnect_reason: params.disconnect_reason,
        disconnect_type: params.disconnect_type,
        rating: params.rating,
        review: params.review,
        created_at: params.created_at,
        updated_at: params.updated_at,
    };
    return data;
}

function load(fields) {
    // param map
    const paramsMap = {
        consultation_uid: 'consultation_uid',
        doctor_name: 'doctor_name',
        patient_name: 'patient_name',
        duration: 'duration',
        start_time: 'start_time',
        end_time: 'end_time',
        conversation_id: 'conversation_id',
        media_type: 'media_type',
        invite_type: 'invite_type',
        disconnect_reason: 'disconnect_reason',
        disconnect_type: 'disconnect_type',
        rating: 'rating',
        review: 'review',
    };

    let updateParams = {};

    for (const param in fields) {
        const key = paramsMap[param];
        updateParams[key] = fields[param];
    }

    return { updateParams }
}

function generateDateFilter({ startDate, endDate }) {
    let whereOptions = {}

    if (startDate) {
        whereOptions = {
            ...whereOptions,
            start_time: {
                [operators.gte]: startDate
            }
        }
    }

    if (endDate) {
        whereOptions = {
            ...whereOptions,
            end_time: {
                [operators.lte]: endDate
            }
        }
    }

    return whereOptions;
}