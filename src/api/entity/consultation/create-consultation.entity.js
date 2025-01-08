module.exports = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  lang,
  params = {
    patient_uid,
    preferred_schedule,
    duration,
    treatment_id,
    specialization_uid,
    patient_summary,
    // preferred_lang,
    // temp_user,
    // temp_patient_uid,
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
  },
}) => {
  return Object.freeze({
    async generate() {
      try {
        const validate = DataValidator({ CreateError, lang, translate });

        let entity = {
          patient_uid: null,
          preferred_schedule: null,
          duration: null,
          treatment_id: null,
          specialization_uid: null,
          patient_summary: [],
          // preferred_lang: ["German"],
          // temp_user: false,
          // temp_patient_uid: null,
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
        };

        if (params.patient_uid) {
          entity.patient_uid = validate.uuid(params.patient_uid).data.value;
        } else {
          throw new CreateError(translate(lang, "invalid_patient_uid"));
        }

        if (params.preferred_schedule) {
          entity.preferred_schedule = validate.timestamp(
            params.preferred_schedule
          ).data.value;
        } else {
          throw new CreateError(translate(lang, "required_preferred_schedule"));
        }

        if (params.duration) {
          entity.duration = validate.duration(params.duration).data.value;
        } else {
          delete entity.duration;
        }

        if (params.documents_uid) {
          entity.documents_uid = params.documents_uid;
        } else {
          delete entity.documents_uid;
        }

        if (params.allergies) {
          entity.allergies = params.allergies;
        } else {
          delete entity.allergies;
        }

        if (params.patient_summary) {
          entity.patient_summary = params.patient_summary;
          // const validatedSummary = params.patient_summary;
          // for (let i = 0; i < validatedSummary.length; i++) {
          //   await validate
          //     .patientSummary(validatedSummary[i])
          //     .then((r) => entity.patient_summary.push(r))
          //     .catch((error) => {
          //       throw new CreateError(error);
          //     });
          // }
        } else {
          throw new CreateError(translate(lang, "required_summary"));
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
          msg: "success",
          data: { entity },
        };
      } catch (error) {
        logger.error("Failed to create consultation entity: %s", error);
        if (error instanceof CreateError) {
          throw error;
        }
        throw new Error(translate(lang, "error_unknown"));
      }
    },
  });
};
