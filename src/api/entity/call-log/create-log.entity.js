module.exports = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    lang,
    params = {
        consultation_uid,
        doctor_name,
        patient_name,
        start_time,
        end_time,
        conversation_id,
        media_type,
        invite_type,
        disconnect_reason,
        disconnect_type,
        rating,
        review,
    }
}) => {
    return Object.freeze({
        async generate() {
            try {
                const validate = DataValidator({ CreateError, lang, translate });

                let entity = {
                    consultation_uid: null,
                    doctor_name: null,
                    patient_name: null,
                    start_time: null,
                    end_time: null,
                    duration: 0,
                    conversation_id: null,
                    media_type: null,
                    invite_type: null,
                    disconnect_reason: null,
                    disconnect_type: null,
                    rating: null,
                    review: null,
                }

                if (params.consultation_uid) {
                    entity.consultation_uid = validate.uuid(params.consultation_uid).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_consulation_uid'));
                }

                if (params.doctor_name) {
                    entity.doctor_name = validate.fullname(params.doctor_name).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_doctor_name'));
                }

                if (params.patient_name) {
                    entity.patient_name = validate.fullname(params.patient_name).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_patient_name'));
                }

                if (params.start_time) {
                    entity.start_time = validate.timestamp(params.start_time).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_log_start_time'))
                }

                if (params.end_time) {
                    entity.end_time = validate.timestamp(params.end_time).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_log_end_time'))
                }

                const secs = (new Date(entity.end_time).getTime() - new Date(entity.start_time).getTime()) / 1000;
                entity.duration = Math.abs(Math.round(secs));

                if (params.conversation_id) {
                    entity.conversation_id = validate.conversationId(params.conversation_id).data.value;
                } else {
                    throw new CreateError(translate(lang, 'required_conversation_id'));
                }

                if (params.media_type) {
                    entity.media_type = validate.toString(params.media_type).data.value;
                } else {
                    entity.media_type = null;
                }

                if (params.invite_type) {
                    entity.invite_type = validate.inviteType(params.invite_type).data.value;
                } else {
                    entity.invite_type = null;
                }

                if (params.disconnect_reason) {
                    entity.disconnect_reason = validate.toString(params.disconnect_reason).data.value;
                } else {
                    entity.disconnect_reason = null;
                }

                if (params.disconnect_type) {
                    entity.disconnect_type = validate.toString(params.disconnect_type).data.value;
                } else {
                    entity.disconnect_type = null;
                }

                if (params.rating) {
                    entity.rating = validate.toString(params.rating).data.value;
                } else {
                    entity.rating = null;
                }

                if (params.review) {
                    entity.review = validate.toString(params.review).data.value;
                } else {
                    entity.review = null;
                }

                return {
                    msg: 'success',
                    data: { entity }
                }

            } catch (error) {
                logger.error('Failed to create call log entity: %s', error);
                if (error instanceof CreateError) {
                    throw error;
                }
                throw new Error(translate(lang, 'error_unknown'))
            }
        }
    })
}
