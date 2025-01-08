module.exports.patient = {
  profile: {
    // 'create:any': ['*', '!views'],
    "read:own": [
      "*",
      "!password",
      "!invalid_attempts",
      "!force_reset_password",
    ],
    "update:own": [
      "salute",
      "title",
      "avatar_url",
      "address_line_1",
      "address_line_2",
      "city",
      "dob",
      "postal_code",
      "country",
      "state",
      "lanugage",
      "first_login",
      "fax",
      "phone",
      "telephone",
      "address",
      "height",
      "weight",
      "structure",
      "guardian"
    ],
    // 'delete:any': ['*']
  },
  device: {
    "create:own": ["*"],
    "update:own": ["device_name", "notification_id"],
    "read:own": ["*"],
    "delete:own": ["*"],
  },
  doctor: {},
  practice: {},
  treatmentCategories: {
    "read:any": ["*"],
  },
  treatment: {
    "read:any": ["*"],
  },
  specialization: {
    "read:any": ["*"],
  },
  consultation: {
    "create:own": [
      "preferred_schedule",
      "duration",
      "treatment_id",
      "specialization_uid",
      "patient_summary",
      // "preferred_lang",
      // "temp_user",
      // "temp_patient_uid",
      "permit_documents",
      "duration",
      "history",
      "investigations",
      "treatments",
      "medication",
      "allergies",
      "previous_illnesses",
      "past_medical_history",
      "state_of_digestion",
      "menstruation",
      "patient_files",
      "diet",
      "documents_uid"
    ],
    "read:own": ["*"],
    "update:own": ["status", "new_schedule", "duration", "documents_uid"],
    // 'delete:own': ['*']
  },
  consultationDoctor: {
    // 'create:any': ['*'],
    // 'read:any': ['*'],
    "update:own": ["medical_charges"],
    // 'delete:any': ['*']
  },
  documents: {
    "create:own": ["*"],
    "read:own": ["*"],
    "update:own": ["*"],
    "delete:own": ["*"],
  },
  callLog: {
    "create:own": ["*"],
    "read:own": ["*"],
    "update:own": ["rating", "review"],
    // 'delete:own': ['*']
  },
  insurance: {
    "create:own": ["*"],
    "read:own": ["*"],
    "update:own": ["*"],
    "delete:own": ["*"],
  },
  medicalRates: {
    "read:any": ["*"],
  },
};
