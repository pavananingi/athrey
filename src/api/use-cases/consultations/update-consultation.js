'use strict';
const fromEntity = require('../../entity');

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

                if (!consultationUID) {
                    throw new CreateError(translate(lang, 'invalid_consultation_uid'))
                }

                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }

                let permission = ac.can(role).updateOwn('consultation');

                if (urlParams.userUID) {
                    if (urlParams.userUID !== userUID) {
                        permission = ac.can(role).updateAny('consultation');
                    }
                }

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).updateAny('consultation');
                }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                // filter body based on the role
                const body = permission.filter(request.body);

                const entity = (await fromEntity.entities
                    .Consultation
                    .UpdateConsultation({
                        CreateError,
                        DataValidator,
                        logger,
                        translate,
                        lang,
                        params: {
                            ...body,
                        }
                    }).generate()).data.entity

                const consultationsTable = db.methods.Consultations({ translate, logger, CreateError, lang });

                const updateStatus = await consultationsTable.updateByUID({ params: entity, consultationUID });

                const updatedDetails = (await consultationsTable.findByUID({ consultationUID })).data.consultations;

                return {
                    msg: translate(lang, 'updated_consultation'),
                    data: { consultations: updatedDetails }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to update consultation: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}