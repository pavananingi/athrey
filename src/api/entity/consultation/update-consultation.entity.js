module.exports = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    lang,
    params = {
        preferred_schedule,
        preferred_lang,
        is_valid,
        status,
        permit_documents,
        duration,
        history,
        investigations,
        treatments,
        medication,
        allergies,
        previous_illnesses,
        past_medical_history,
        state_of_digestion,
        menstruation,
        patient_files,
        diet,
        documents_uid
    }
}) => {
    return Object.freeze({
        async generate() {
            try {
                const validate = DataValidator({ CreateError, lang, translate });

                let entity = {
                    preferred_schedule: null,
                    preferred_lang: [],
                    is_valid: null,
                    status: null,
                    permit_documents: null,
                    duration: null,
                    history: null,
                    investigations: null,
                    treatments: null,
                    medication: null,
                    allergies: null,
                    previous_illnesses: null,
                    past_medical_history: null,
                    state_of_digestion: null,
                    menstruation: null,
                    patient_files: null,
                    diet: null,
                    documents_uid: null
                }

                if (params.preferred_schedule) {
                    entity.preferred_schedule = validate.timerange(params.preferred_schedule).data.value;
                } else {
                    delete entity.preferred_schedule;
                }

                if (params.preferred_lang) {
                    entity.preferred_lang = validate.preferredLanguages(params.preferred_lang).data.value;
                } else {
                    delete entity.preferred_lang;
                }

                if (params.status) {
                    entity.status = validate.consultationStatus(params.status).data.value;
                } else {
                    delete entity.status;
                }

                if (params.is_valid === true || params.is_valid === false) {
                    entity.is_valid = validate.boolean(params.is_valid).data.value;
                } else {
                    delete entity.is_valid;
                }

                if (params.documents_uid) {
                    entity.documents_uid = JSON.stringify(params.documents_uid);
                } else {
                    delete entity.documents_uid;
                }

                if (params.permit_documents) {
                    entity.permit_documents = params.permit_documents;
                } else {
                    delete entity.permit_documents;
                }

                if (params.duration) {
                    entity.duration = params.duration;
                } else {
                    delete entity.duration;
                }

                if (params.history) {
                    entity.history = params.history;
                } else {
                    delete entity.history;
                }

                if (params.investigations) {
                    entity.investigations = params.investigations;
                } else {
                    delete entity.investigations;
                }

                if (params.treatments) {
                    entity.treatments = params.treatments;
                } else {
                    delete entity.treatments;
                }

                if (params.medication) {
                    entity.medication = params.medication;
                } else {
                    delete entity.medication;
                }

                if (params.previous_illnesses) {
                    entity.previous_illnesses = params.previous_illnesses;
                } else {
                    delete entity.previous_illnesses;
                }

                if (params.past_medical_history) {
                    entity.past_medical_history = params.past_medical_history;
                } else {
                    delete entity.past_medical_history;
                }

                if (params.state_of_digestion) {
                    entity.state_of_digestion = params.state_of_digestion;
                } else {
                    delete entity.state_of_digestion;
                }

                if (params.menstruation) {
                    entity.menstruation = params.menstruation;
                } else {
                    delete entity.menstruation;
                }

                if (params.patient_files) {
                    entity.patient_files = params.patient_files;
                } else {
                    delete entity.patient_files;
                }

                if (params.diet) {
                    entity.diet = params.diet;
                } else {
                    delete entity.diet;
                }
                return {
                    msg: 'success',
                    data: { entity }
                }

            } catch (error) {
                logger.error('Failed to create update consultation entity: %s', error);
                if (error instanceof CreateError) {
                    throw error;
                }
                throw new Error(translate(lang, 'error_unknown'))
            }
        }
    })
}
