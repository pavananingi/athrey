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
                const doctorUID = request.urlParams.doctorUID;
                const body = request.body;


                if (!consultationUID) {
                    throw new CreateError(translate(lang, 'invalid_consultation_uid'))
                }

                if (!doctorUID) {
                    throw new CreateError(translate(lang, 'invalid_doctor_uid'))
                }

                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }

                if (role === 'doctor') {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const entity = (await fromEntity.entities
                    .Consultation
                    .UpdateConsultationCharge({
                        CreateError,
                        DataValidator,
                        logger,
                        translate,
                        lang,
                        params: {
                            ...body,
                        }
                    }).generate()).data.entity;


                const consultationDoctorTable = db.methods.ConsultationDoctors({ translate, logger, CreateError, lang });

                const updateStatus = await consultationDoctorTable.updateByDoctorConsUID({
                    consultationUID: consultationUID,
                    doctorUID: doctorUID,
                    params: {
                        medical_charges: entity
                    }
                });

                const updatedDetails = (await consultationDoctorTable.findAllByConsUID({ consultationUID })).data.doctors;

                return {
                    msg: translate(lang, 'updated_success'),
                    data: { doctors: updatedDetails }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to update consultation doctor charges: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}