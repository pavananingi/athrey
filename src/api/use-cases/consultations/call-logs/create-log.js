'use strict';
const fromEntity = require('../../../entity');
const stripe = require("../../../lib/payment/connection");


module.exports = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    request,
    db,
    ac,
}) => {
    return Object.freeze({
        execute: async () => {
            try {

                const lang = request.lang;
                const userUID = request.locals.uid;
                const role = request.locals.role;
                const urlParams = request.urlParams;
                const body = request.body;
                const consultationUID = request.urlParams.uid;

                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }

                let permission = ac.can(role).createOwn('callLog');

                if (urlParams.userUID) {
                    if (urlParams.userUID !== userUID) {
                        permission = ac.can(role).createAny('callLog');
                    }
                }

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).createAny('callLog');
                }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }
                // find the consultation
                const consultationsTable = db.methods.Consultations({ translate, logger, CreateError, lang });
                const consultation = (await consultationsTable.findByUID({ consultationUID: consultationUID }))
                    .data.consultations;

                if (!consultation) {
                    throw new CreateError(translate(lang, 'invalid_consultation_uid'))
                }

                const entity = (await fromEntity.entities
                    .CallLog
                    .CreateCallLog({
                        CreateError,
                        DataValidator,
                        logger,
                        translate,
                        lang,
                        params: {
                            ...body,
                            consultation_uid: consultation.uid
                        }
                    }).generate()).data.entity;

                const create = (await db.methods.CallLogs({ translate, logger, CreateError, lang })
                    .create(entity))
                    .data.logs;


                if (entity.duration > 0) {
                    //  move the consultation status to complete
                    consultationsTable.updateStatusByUID({
                        consultationUID: consultation.uid,
                        status: 'completed'
                    })

                    const consultationDoctorTable = db.methods.ConsultationDoctors({ translate, logger, CreateError, lang })

                    // move the doctor consulation status to review
                    consultation.doctor.forEach(d => {
                        if (d.status !== 'completed' && d.status !== 'cancelled') {
                            consultationDoctorTable.updateByDoctorConsUID({
                                consultationUID: consultation.uid,
                                doctorUID: d.doctor_uid,
                                params: {
                                    status: 'review'
                                }
                            })
                        }
                    });

                    // update sub duration
                    if (role == 'doctor') {
                        const usersTable = db.methods.User({
                            translate,
                            logger,
                            CreateError,
                            lang,
                        });

                        const user = (
                            await usersTable.findByUID({ uid: userUID, includeAll: false })
                        ).data.users;

                        let payable_call_duration = 0;
                        if (user?.subscriptions?.status == 'paid' && user?.subscriptions?.active && new Date(user?.subscriptions?.end_date) > new Date()) {
                            payable_call_duration = entity.duration;

                            if (user?.subscriptions?.subitem_stripe_id) {
                                const timestamp = parseInt(Date.now() / 1000);

                                const addRecord = await stripe.subscriptionItems.createUsageRecord(
                                    user.subscriptions.subitem_stripe_id,
                                    {
                                        quantity: Math.round((user.payable_call_duration + entity.duration) / 60),
                                        timestamp: timestamp,
                                        action: 'set',
                                    }
                                );
                            }
                        }
                        const updateUser = (await usersTable.updateByUID(
                            {
                                uid: userUID,
                                params: {
                                    payable_call_duration: payable_call_duration,
                                    total_call_duration: entity.duration,
                                },
                                fromLog: true
                            }
                        ));
                    }
                }

                return {
                    msg: translate(lang, 'success'),
                    data: { logs: create }
                }
            }
            catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to create call log: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}