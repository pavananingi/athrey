'use strict';
const fromEntity = require('../../../entity');

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
                const consultationUID = request.urlParams.uid;
                const logID = request.urlParams.id;

                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }

                let permission = ac.can(role).updateOwn('callLog');

                if (urlParams.userUID) {
                    if (urlParams.userUID !== userUID) {
                        permission = ac.can(role).updateAny('callLog');
                    }
                }

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).updateAny('callLog');
                }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                // filter body based on the role
                const body = permission.filter(request.body);

                // find the consultation
                const consultationsTable = db.methods.Consultations({ translate, logger, CreateError, lang });
                const consultation = (await consultationsTable.findByUID({ consultationUID: consultationUID }))
                    .data.consultations;

                if (!consultation) {
                    throw new CreateError(translate(lang, 'invalid_consultation_uid'))
                }

                const entity = (await fromEntity.entities
                    .CallLog
                    .UpdateCallLog({
                        CreateError,
                        DataValidator,
                        logger,
                        translate,
                        lang,
                        params: {
                            ...body
                        }
                    }).generate()).data.entity;

                const status = (await db.methods
                    .CallLogs({ translate, logger, CreateError, lang })
                    .updateByID({
                        id: logID,
                        params: entity
                    })).data.logs;

                const updated = (await db.methods
                    .CallLogs({ translate, logger, CreateError, lang })
                    .findByConsUID({ consultationUID: consultation.uid, }))
                    .data.logs;

                // todo: move the consultation status to complete
                consultationsTable.updateStatusByUID({
                    consultationUID: consultation.uid,
                    status: 'completed'
                })

                const consultationDoctorTable = db.methods.ConsultationDoctors({ translate, logger, CreateError, lang })

                // todo: move the doctor consulation status to review
                consultation.doctor.forEach(d => {
                    if (d.status !== 'completed' && d.status !== 'cancelled') {
                        consultationDoctorTable.updateByDoctorConsUID({
                            consultationUID: consultation.uid,
                            doctorUID: consultation.doctor_uid,
                            params: {
                                status: 'review'
                            }
                        })
                    }
                });

                return {
                    msg: translate(lang, 'success'),
                    data: { logs: updated }
                }
            }
            catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to update call log: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}