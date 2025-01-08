exports.UpdateDoctorEntity = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    lang,
    params = {
        specialization,
        biography,
        qualification,
        experience,
        id_front_uid,
        id_back_uid,
        verification_status,
        verified_by,
        verified_on,
        id_photo_uid
    }
}) => {
    return Object.freeze({
        generate: () => {
            try {
                const validate = DataValidator({ CreateError, lang, translate });

                let entity = {
                    specialization: null,
                    biography: null,
                    qualification: null,
                    experience: null,
                    id_front_uid: null,
                    id_back_uid: null,
                    id_photo_uid: null
                };

                if (params.specialization) {
                    entity.specialization = validate.specialization(params.specialization).data.value;
                } else {
                    delete entity.specialization;
                }

                if (params.biography) {
                    entity.biography = validate.biography(params.biography).data.value;
                } else if (params.biography === null) {
                    entity.biography = null;
                } else {
                    delete entity.biography;
                }

                if (params.qualification) {
                    entity.qualification = validate.qualification(params.qualification).data.value;
                } else {
                    delete entity.qualification;
                }

                if (params.experience) {
                    entity.experience = validate.experience(params.experience).data.value;
                } else {
                    delete entity.experience;
                }


                if (params.id_back_uid) {
                    entity.id_back_uid = validate.uuid(params.id_back_uid).data.value;
                } else {
                    delete entity.id_back_uid;
                }

                if (params.id_photo_uid) {
                    entity.id_photo_uid = validate.uuid(params.id_photo_uid).data.value;
                } else {
                    delete entity.id_photo_uid;
                }

                if (params.id_front_uid) {
                    entity.id_front_uid = validate.uuid(params.id_front_uid).data.value;
                } else {
                    delete entity.id_front_uid
                }

                return {
                    msg: translate(lang, 'success'),
                    data: { entity }
                }
            } catch (error) {
                logger.error('Failed to update doctor entity: %s', error);
                if (error instanceof CreateError) {
                    throw error;
                }
                throw new Error(translate(lang, 'error_unknown'))
            }
        }
    })
}