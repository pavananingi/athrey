const models = require("../models").models;
const dbCon = require("../connection").db;
const operators = require("../connection").operators;
const sequelize = require("../connection").sequelize;

module.exports = ({ translate, logger, CreateError, lang }) => {
  const specializationAttributes = [
    ["uid", "uid"],
    ["specialization", "specialization"],
    ["description", "description"],
    ["questions", "questions"],
    ["illustration_url", "illustration_url"],
  ];

  const treatmentAttributes = [
    ["id", "id"],
    ["treatment", "treatment"],
    ["description", "description"],
    ["questions", "questions"],
    ["category_uid", "category_uid"],
    ["illustration_url", "illustration_url"],
  ];

  const consultationDoctorAttributes = [
    ["consultation_uid", "consultation_uid"],
    ["doctor_uid", "doctor_uid"],
    ["confirmed_schedule", "confirmed_schedule"],
    ["duration", "duration"],
    ["notes", "notes"],
    ["status", "status"],
    ["leave_letter", "leave_letter"],
    ["leave_letter_doc_uid", "leave_letter_doc_uid"],
    ["prescription", "prescription"],
    ["prescription_doc_uid", "prescription_doc_uid"],
    ["diagnosis", "diagnosis"],
    ["diagnosis_doc_uid", "diagnosis_doc_uid"],
    ["invoices_doc_uid", "invoices_doc_uid"],
    ["invoice_id", "invoice_id"],
    ["invoice_status", "invoice_status"],
    ["rating", "rating"],
    ["review", "review"],
    ["manual_invoice", "manual_invoice"],
    ["medical_charges", "medical_charges"],
    ["medical_charges_doc_uid", "medical_charges_doc_uid"],
  ];

  const patientAttributes = [
    ["id", "id"],
    ["salute", "salute"],
    ["title", "title"],
    ["firstname", "firstname"],
    ["lastname", "lastname"],
    ["avatar_url", "avatar_url"],
    ["dob", "dob"],
    // ["address_line_1", "address_line_1"],
    // ["address_line_2", "address_line_2"],
    ["city", "city"],
    ["postal_code", "postal_code"],
    ["country", "country"],
    ["state", "state"],
  ];

  const temppatientAttributes = [
    ["firstname", "firstname"],
    ["lastname", "lastname"],
    ["email", "email"],
    ["uid", "uid"],
  ];

  const doctorAttributes = [
    ["id", "id"],
    ["salute", "salute"],
    ["title", "title"],
    ["firstname", "firstname"],
    ["lastname", "lastname"],
    ["avatar_url", "avatar_url"],
    ["dob", "dob"],
    // ["address_line_1", "address_line_1"],
    // ["address_line_2", "address_line_2"],
    ["city", "city"],
    ["postal_code", "postal_code"],
    ["country", "country"],
    ["state", "state"],
  ];

  const doctorDetailsAttributes = [
    ["specialization", "specialization"],
    ["biography", "biography"],
    ["qualification", "qualification"],
    ["experience", "experience"],
    ["account_institution_name", "account_institution_name"],
    ["account_holder_name", "account_holder_name"],
    ["account_iban", "account_iban"],
    ["account_bic", "account_bic"],
  ];

  const documentAttributes = [
    ["uid", "uid"],
    ["user_uid", "user_uid"],
    ["url", "url"],
    ["name", "name"],
    ["created_at", "created_at"],
    ["updated_at", "updated_at"],
  ];

  return Object.freeze({
    create: async (params) => {
      try {
        const constructedParams = load(params);

        const create = await models.Consultations.create(
          constructedParams.updateParams
        );
        return {
          msg: `Created consultation successfully`,
          data: { consultations: unload(create) },
        };
      } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
          throw new CreateError(translate(lang, "duplicate_consultation"), 409);
        }
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          "Failed to create consultation: %s %s",
          error.message,
          error
        );
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },
    updateByUID: async ({ consultationUID, params }) => {
      try {
        const constructedParams = load(params);
        const update = await models.Consultations.update(
          constructedParams.updateParams,
          {
            where: {
              uid: consultationUID,
            },
          }
        );
        return {
          msg: `Updated consultation details successfully`,
          data: {},
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          "Failed to update consultation details: %s %s",
          error.message,
          error
        );
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },
    findByUID: async ({ consultationUID }) => {
      try {
        const find = await models.Consultations.findOne({
          include: [
            {
              model: models.ConsultationDoctors,
              as: "doctor",
              required: false,
              attributes: consultationDoctorAttributes,
              include: [
                {
                  model: models.User,
                  as: "profile",
                  required: false,
                  attributes: doctorAttributes,
                },
                {
                  model: models.DoctorDetails,
                  as: "professional",
                  required: false,
                  attributes: doctorDetailsAttributes,
                },
                {
                  model: models.Documents,
                  as: "diagnosis_document",
                  required: false,
                  attributes: documentAttributes,
                },
              ],
            },
            {
              model: models.Treatments,
              as: "treatment",
              required: false,
              attributes: treatmentAttributes,
            },
            {
              model: models.Specializations,
              as: "specialization",
              required: false,
              attributes: specializationAttributes,
            },
            {
              model: models.User,
              as: "patient",
              required: false,
              attributes: patientAttributes,
            },
            // {
            //   model: models.TempUser,
            //   as: "temppatient",
            //   required: false,
            //   attributes: temppatientAttributes,
            // },
            {
              model: models.CallLogs,
              as: "logs",
              required: false,
            },
          ],
          where: {
            uid: consultationUID,
          },
        });

        return {
          msg: `Found consultation details successfully`,
          data: { consultations: unload(find) },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          "Failed to find consultation details by UID: %s %s",
          error.message,
          error
        );
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },
    findByUIDPatientUID: async ({ consultationUID, patientUID }) => {
      try {
        const find = await models.Consultations.findOne({
          include: [
            {
              model: models.ConsultationDoctors,
              as: "doctor",
              required: false,
              attributes: consultationDoctorAttributes,
              include: [
                {
                  model: models.User,
                  as: "profile",
                  required: false,
                  attributes: doctorAttributes,
                },
                {
                  model: models.DoctorDetails,
                  as: "professional",
                  required: false,
                  attributes: doctorDetailsAttributes,
                },
                {
                  model: models.Documents,
                  as: "diagnosis_document",
                  required: false,
                  attributes: documentAttributes,
                },
              ],
            },
            {
              model: models.Treatments,
              as: "treatment",
              required: false,
              attributes: treatmentAttributes,
            },
            {
              model: models.Specializations,
              as: "specialization",
              required: false,
              attributes: specializationAttributes,
            },
            {
              model: models.User,
              as: "patient",
              required: false,
              attributes: patientAttributes,
            },
            // {
            //   model: models.TempUser,
            //   as: "temppatient",
            //   required: false,
            //   attributes: temppatientAttributes,
            // },
            {
              model: models.CallLogs,
              as: "logs",
              required: false,
            },
          ],
          where: {
            uid: consultationUID,
            patient_uid: patientUID,
          },
        });
        return {
          msg: `Found consultation details successfully`,
          data: { consultations: find ? unload(find) : null },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          "Failed to find consultation details by UID: %s %s",
          error.message,
          error
        );
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },
    // findByUIDTempPatientUID: async ({ patientUID }) => {
    //   try {
    //     const find = await models.Consultations.findOne({
    //       include: [
    //         {
    //           model: models.ConsultationDoctors,
    //           as: "doctor",
    //           required: false,
    //           attributes: consultationDoctorAttributes,
    //           include: [
    //             {
    //               model: models.User,
    //               as: "profile",
    //               required: false,
    //               attributes: doctorAttributes,
    //             },
    //             {
    //               model: models.DoctorDetails,
    //               as: "professional",
    //               required: false,
    //               attributes: doctorDetailsAttributes,
    //             },
    //             {
    //               model: models.Documents,
    //               as: "diagnosis_document",
    //               required: false,
    //               attributes: documentAttributes,
    //             },
    //           ],
    //         },
    //         {
    //           model: models.Treatments,
    //           as: "treatment",
    //           required: false,
    //           attributes: treatmentAttributes,
    //         },
    //         {
    //           model: models.Specializations,
    //           as: "specialization",
    //           required: false,
    //           attributes: specializationAttributes,
    //         },
    //         {
    //           model: models.User,
    //           as: "patient",
    //           required: false,
    //           attributes: patientAttributes,
    //         },
    //         {
    //           model: models.TempUser,
    //           as: "temppatient",
    //           required: false,
    //           attributes: temppatientAttributes,
    //         },
    //         {
    //           model: models.CallLogs,
    //           as: "logs",
    //           required: false,
    //         },
    //       ],
    //       where: {
    //         temp_patient_uid: patientUID,
    //       },
    //     });
    //     return {
    //       msg: `Found consultation details successfully`,
    //       data: { consultations: find ? unload(find) : null },
    //     };
    //   } catch (error) {
    //     if (error instanceof CreateError) {
    //       throw error;
    //     }
    //     logger.error(
    //       "Failed to find consultation details by UID: %s %s",
    //       error.message,
    //       error
    //     );
    //     throw Error(translate(lang, "unknown_error_contact_support"));
    //   }
    // },
    updateStatusByUID: async ({ consultationUID, status }) => {
      try {
        const update = await models.Consultations.update(
          {
            status: status,
          },
          {
            where: {
              uid: consultationUID,
            },
          }
        );
        return {
          msg: `Updated consultation details successfully`,
          data: {},
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          "Failed to update consultation details: %s %s",
          error.message,
          error
        );
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },
    findAllScheduledByDoctorUID: async ({ doctorUID }) => {
      try {
        const find = await models.Consultations.findAll({
          include: [
            {
              model: models.ConsultationDoctors,
              as: "doctor",
              required: true,
              attributes: consultationDoctorAttributes,
              where: {
                doctor_uid: doctorUID,
              },
            },
            {
              model: models.Treatments,
              as: "treatment",
              required: false,
              attributes: treatmentAttributes,
            },
            {
              model: models.Specializations,
              as: "specialization",
              required: false,
              attributes: specializationAttributes,
            },
            {
              model: models.User,
              as: "patient",
              required: false,
              attributes: patientAttributes,
            },
            // {
            //   model: models.TempUser,
            //   as: "temppatient",
            //   required: false,
            //   attributes: temppatientAttributes,
            // },
            {
              model: models.CallLogs,
              as: "logs",
              required: false,
            },
          ],
          where: {
            status: "scheduled",
          },
          order: [["doctor", "created_at", "DESC"]],
          limit: 100,
        });
        return {
          msg: `Find consultation result`,
          data: { consultations: find },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          "Failed to find consultations by doctor uid: %s %s",
          error.message,
          error
        );
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },
    findAllScheduledByPatientUID: async ({ patientUID }) => {
      try {
        const find = await models.Consultations.findAll({
          include: [
            {
              model: models.ConsultationDoctors,
              as: "doctor",
              required: false,
              attributes: consultationDoctorAttributes,
              include: [
                {
                  model: models.User,
                  as: "profile",
                  required: true,
                  attributes: doctorAttributes,
                },
                {
                  model: models.DoctorDetails,
                  as: "professional",
                  required: false,
                  attributes: doctorDetailsAttributes,
                },
                {
                  model: models.Documents,
                  as: "diagnosis_document",
                  required: false,
                  attributes: documentAttributes,
                },
              ],
              where: {
                status: "scheduled",
              },
            },
            {
              model: models.Treatments,
              as: "treatment",
              required: false,
              attributes: treatmentAttributes,
            },
            {
              model: models.Specializations,
              as: "specialization",
              required: false,
              attributes: specializationAttributes,
            },
            {
              model: models.CallLogs,
              as: "logs",
              required: false,
            },
          ],
          where: {
            patient_uid: patientUID,
            status: "scheduled",
          },
          order: [["doctor", "confirmed_schedule", "DESC"]],
          limit: 100,
        });
        return {
          msg: `Find consultation result`,
          data: { consultations: find },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          "Failed to find consultations by doctor uid: %s %s",
          error.message,
          error
        );
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },
    findAllCancelledByDoctorUID: async ({ doctorUID }) => {
      try {
        const find = await models.Consultations.findAll({
          include: [
            {
              model: models.ConsultationDoctors,
              as: "doctor",
              required: true,
              attributes: consultationDoctorAttributes,
              where: {
                doctor_uid: doctorUID,
                status: "cancelled",
              },
            },
            {
              model: models.Treatments,
              as: "treatment",
              required: false,
              attributes: treatmentAttributes,
            },
            {
              model: models.Specializations,
              as: "specialization",
              required: false,
              attributes: specializationAttributes,
            },
            {
              model: models.User,
              as: "patient",
              required: false,
              attributes: patientAttributes,
            },
            // {
            //   model: models.TempUser,
            //   as: "temppatient",
            //   required: false,
            //   attributes: temppatientAttributes,
            // },
            {
              model: models.CallLogs,
              as: "logs",
              required: false,
            },
          ],
          order: [["doctor", "confirmed_schedule", "DESC"]],
          limit: 100,
        });
        return {
          msg: `Find consultation result`,
          data: { consultations: find },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          "Failed to find consultations by doctor uid: %s %s",
          error.message,
          error
        );
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },
    findAllCancelledByPatientUID: async ({ patientUID }) => {
      try {
        const find = await models.Consultations.findAll({
          include: [
            {
              model: models.ConsultationDoctors,
              as: "doctor",
              required: false,
              attributes: consultationDoctorAttributes,
              include: [
                {
                  model: models.User,
                  as: "profile",
                  required: true,
                  attributes: doctorAttributes,
                },
                {
                  model: models.DoctorDetails,
                  as: "professional",
                  required: false,
                  attributes: doctorDetailsAttributes,
                },
                {
                  model: models.Documents,
                  as: "diagnosis_document",
                  required: false,
                  attributes: documentAttributes,
                },
              ],
            },
            {
              model: models.Treatments,
              as: "treatment",
              required: false,
              attributes: treatmentAttributes,
            },
            {
              model: models.Specializations,
              as: "specialization",
              required: false,
              attributes: specializationAttributes,
            },
            {
              model: models.CallLogs,
              as: "logs",
              required: false,
            },
          ],
          where: {
            patient_uid: patientUID,
            status: "cancelled",
          },
          order: [["doctor", "confirmed_schedule", "DESC"]],
        });
        return {
          msg: `Find consultation result`,
          data: { consultations: find },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          "Failed to find consultations by doctor uid: %s %s",
          error.message,
          error
        );
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },
    findAllCompletedByDoctorUID: async ({ doctorUID }) => {
      try {
        const find = await models.Consultations.findAll({
          include: [
            {
              model: models.ConsultationDoctors,
              as: "doctor",
              required: true,
              attributes: consultationDoctorAttributes,
              where: {
                doctor_uid: doctorUID,
                status: "completed",
              },
            },
            {
              model: models.Treatments,
              as: "treatment",
              required: false,
              attributes: treatmentAttributes,
            },
            {
              model: models.Specializations,
              as: "specialization",
              required: false,
              attributes: specializationAttributes,
            },
            {
              model: models.User,
              as: "patient",
              required: false,
              attributes: patientAttributes,
            },
            // {
            //   model: models.TempUser,
            //   as: "temppatient",
            //   required: false,
            //   attributes: temppatientAttributes,
            // },
            {
              model: models.CallLogs,
              as: "logs",
              required: false,
            },
          ],
          where: {
            status: "completed",
          },
          order: [["doctor", "confirmed_schedule", "DESC"]],
          limit: 100,
        });
        return {
          msg: `Find consultation result`,
          data: { consultations: find },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          "Failed to find consultations by doctor uid: %s %s",
          error.message,
          error
        );
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },
    findAllReviewByDoctorUID: async ({ doctorUID }) => {
      try {
        const find = await models.Consultations.findAll({
          include: [
            {
              model: models.ConsultationDoctors,
              as: "doctor",
              required: true,
              attributes: consultationDoctorAttributes,
              where: {
                doctor_uid: doctorUID,
                status: "review",
              },
            },
            {
              model: models.Treatments,
              as: "treatment",
              required: false,
              attributes: treatmentAttributes,
            },
            {
              model: models.Specializations,
              as: "specialization",
              required: false,
              attributes: specializationAttributes,
            },
            {
              model: models.User,
              as: "patient",
              required: false,
              attributes: patientAttributes,
            },
            // {
            //   model: models.TempUser,
            //   as: "temppatient",
            //   required: false,
            //   attributes: temppatientAttributes,
            // },
            {
              model: models.CallLogs,
              as: "logs",
              required: false,
            },
          ],
          order: [["doctor", "confirmed_schedule", "DESC"]],
          limit: 100,
        });
        return {
          msg: `Find consultation result`,
          data: { consultations: find },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          "Failed to find consultations by doctor uid: %s %s",
          error.message,
          error
        );
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },
    findAllCompletedByPatientUID: async ({ patientUID }) => {
      try {
        const find = await models.Consultations.findAll({
          include: [
            {
              model: models.ConsultationDoctors,
              as: "doctor",
              required: false,
              attributes: consultationDoctorAttributes,
              include: [
                {
                  model: models.User,
                  as: "profile",
                  required: true,
                  attributes: doctorAttributes,
                },
                {
                  model: models.DoctorDetails,
                  as: "professional",
                  required: false,
                  attributes: doctorDetailsAttributes,
                },
                {
                  model: models.Documents,
                  as: "diagnosis_document",
                  required: false,
                  attributes: documentAttributes,
                },
              ],
            },
            {
              model: models.Treatments,
              as: "treatment",
              required: false,
              attributes: treatmentAttributes,
            },
            {
              model: models.Specializations,
              as: "specialization",
              required: false,
              attributes: specializationAttributes,
            },
            {
              model: models.CallLogs,
              as: "logs",
              required: false,
            },
          ],
          where: {
            patient_uid: patientUID,
            status: "completed",
          },
          order: [["doctor", "confirmed_schedule", "DESC"]],
          limit: 100,
        });
        return {
          msg: `Find consultation result`,
          data: { consultations: find },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          "Failed to find consultations by doctor uid: %s %s",
          error.message,
          error
        );
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },
    findAllReviewByPatientUID: async ({ patientUID }) => {
      try {
        const find = await models.Consultations.findAll({
          include: [
            {
              model: models.ConsultationDoctors,
              as: "doctor",
              required: false,
              attributes: consultationDoctorAttributes,
              include: [
                {
                  model: models.User,
                  as: "profile",
                  required: false,
                  attributes: doctorAttributes,
                },
                {
                  model: models.DoctorDetails,
                  as: "professional",
                  required: false,
                  attributes: doctorDetailsAttributes,
                },
                {
                  model: models.Documents,
                  as: "diagnosis_document",
                  required: false,
                  attributes: documentAttributes,
                },
              ],
              where: {
                status: "review",
              },
            },
            {
              model: models.Treatments,
              as: "treatment",
              required: false,
              attributes: treatmentAttributes,
            },
            {
              model: models.Specializations,
              as: "specialization",
              required: false,
              attributes: specializationAttributes,
            },
            {
              model: models.CallLogs,
              as: "logs",
              required: false,
            },
          ],
          where: {
            patient_uid: patientUID,
          },
          order: [["doctor", "confirmed_schedule", "DESC"]],
          limit: 100,
        });
        return {
          msg: `Find consultation result`,
          data: { consultations: find },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          "Failed to find consultations by doctor uid: %s %s",
          error.message,
          error
        );
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },
    findAllOpen: async ({ }) => {
      try {
        const find = await models.Consultations.findAll({
          include: [
            {
              model: models.Treatments,
              as: "treatment",
              required: false,
              attributes: treatmentAttributes,
            },
            {
              model: models.Specializations,
              as: "specialization",
              required: false,
              attributes: specializationAttributes,
            },
            {
              model: models.User,
              as: "patient",
              required: false,
              attributes: patientAttributes,
            },
            // {
            //   model: models.TempUser,
            //   as: "temppatient",
            //   required: false,
            //   attributes: temppatientAttributes,
            // },
            {
              model: models.CallLogs,
              as: "logs",
              required: false,
            },
          ],
          where: {
            status: "open",
          },
          order: [['created_at', "DESC"]],
        });

        return {
          msg: `Find open consultation result`,
          data: { consultations: find },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          "Failed to find open consultations: %s %s",
          error.message,
          error
        );
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },
    findAllOpenByPatientUID: async ({ patientUID }) => {
      try {
        const find = await models.Consultations.findAll({
          include: [
            {
              model: models.Treatments,
              as: "treatment",
              required: false,
              attributes: treatmentAttributes,
            },
            {
              model: models.Specializations,
              as: "specialization",
              required: false,
              attributes: specializationAttributes,
            },
            {
              model: models.CallLogs,
              as: "logs",
              required: false,
            },
          ],
          where: {
            patient_uid: patientUID,
            status: "open",
          },
          order: [["preferred_schedule", "ASC"]],
          limit: 100,
        });
        return {
          msg: `Find open consultation result`,
          data: { consultations: find },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          "Failed to find open consultations: %s %s",
          error.message,
          error
        );
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },
    findAllDateByDoctorUID: async ({
      doctorUID,
      date,
      offset,
      limit,
      sortBy,
      order,
    }) => {
      try {
        const sortableColumns = ["confirmed_schedule"];

        if (limit) {
          limit = parseInt(limit);
        } else {
          limit = 100;
        }

        if (offset) {
          offset = parseInt(offset);
        } else {
          offset = 0;
        }

        if (sortBy) {
          sortBy = sortBy;
        } else {
          sortBy = "confirmed_schedule";
        }

        if (order) {
          order = order.toUpperCase();
        } else {
          order = "DESC";
        }

        const find = await models.Consultations.findAll({
          include: [
            {
              model: models.ConsultationDoctors,
              as: "doctor",
              required: true,
              attributes: consultationDoctorAttributes,
              where: {
                doctor_uid: doctorUID,
                [operators.and]: [
                  sequelize.where(
                    sequelize.fn("date", sequelize.col("confirmed_schedule")),
                    "=",
                    `${date}`
                  ),
                ],
              },
            },
            {
              model: models.Treatments,
              as: "treatment",
              required: false,
              attributes: treatmentAttributes,
            },
            {
              model: models.Specializations,
              as: "specialization",
              required: false,
              attributes: specializationAttributes,
            },
            {
              model: models.User,
              as: "patient",
              required: false,
              attributes: patientAttributes,
            },
            // {
            //   model: models.TempUser,
            //   as: "temppatient",
            //   required: false,
            //   attributes: temppatientAttributes,
            // },
            {
              model: models.CallLogs,
              as: "logs",
              required: false,
            },
          ],
          order: [["doctor", sortBy, order]],
          offset: offset,
          limit: limit,
        });

        const countConsultations = await models.Consultations.count({
          include: [
            {
              model: models.ConsultationDoctors,
              as: "doctor",
              required: true,
              attributes: consultationDoctorAttributes,
              where: {
                doctor_uid: doctorUID,
                [operators.and]: [
                  sequelize.where(
                    sequelize.fn("date", sequelize.col("confirmed_schedule")),
                    "=",
                    `${date}`
                  ),
                ],
              },
            },
          ],
        });

        return {
          msg: `Find all doctor consultation by date`,
          data: {
            consultations: find,
            offset,
            limit,
            sortBy,
            sortableColumns: sortableColumns,
            total: countConsultations,
            order,
          },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          "Failed to find consultations by doctor uid: %s %s",
          error.message,
          error
        );
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },
    findAllByDoctorUID: async ({ doctorUID, offset, limit, sortBy, order }) => {
      try {
        const sortableColumns = ["confirmed_schedule", "created_at"];

        if (limit) {
          limit = parseInt(limit);
        } else {
          limit = 100;
        }

        if (offset) {
          offset = parseInt(offset);
        } else {
          offset = 0;
        }

        if (sortBy) {
          sortBy = sortBy;
        } else {
          sortBy = "created_at";
        }

        if (order) {
          order = order.toUpperCase();
        } else {
          order = "DESC";
        }

        const find = await models.Consultations.findAll({
          include: [
            {
              model: models.ConsultationDoctors,
              as: "doctor",
              required: true,
              attributes: consultationDoctorAttributes,
              where: {
                doctor_uid: doctorUID,
              },
            },
            {
              model: models.Treatments,
              as: "treatment",
              required: false,
              attributes: treatmentAttributes,
            },
            {
              model: models.Specializations,
              as: "specialization",
              required: false,
              attributes: specializationAttributes,
            },
            {
              model: models.User,
              as: "patient",
              required: false,
              attributes: patientAttributes,
            },
            // {
            //   model: models.TempUser,
            //   as: "temppatient",
            //   required: false,
            //   attributes: temppatientAttributes,
            // },
            {
              model: models.CallLogs,
              as: "logs",
              required: false,
            },
          ],
          order: [["doctor", sortBy, order]],
          offset: offset,
          limit: limit,
        });

        const countConsultations = await models.Consultations.count({
          include: [
            {
              model: models.ConsultationDoctors,
              as: "doctor",
              required: true,
              attributes: consultationDoctorAttributes,
              where: {
                doctor_uid: doctorUID,
              },
            },
          ],
        });

        return {
          msg: `Find all doctor consultation`,
          data: {
            consultations: find,
            offset,
            limit,
            sortBy,
            sortableColumns: sortableColumns,
            total: countConsultations,
            order,
          },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          "Failed to find consultations by doctor uid: %s %s",
          error.message,
          error
        );
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },
    findAllByPatientUID: async ({
      patientUID,
      offset,
      limit,
      sortBy,
      order,
    }) => {
      try {
        const sortableColumns = ["preferred_schedule", "created_at"];

        if (limit) {
          limit = parseInt(limit);
        } else {
          limit = 100;
        }

        if (offset) {
          offset = parseInt(offset);
        } else {
          offset = 0;
        }

        if (sortBy) {
          sortBy = sortBy;
        } else {
          sortBy = "created_at";
        }

        if (order) {
          order = order.toUpperCase();
        } else {
          order = "DESC";
        }

        const find = await models.Consultations.findAll({
          include: [
            {
              model: models.ConsultationDoctors,
              as: "doctor",
              required: false,
              attributes: consultationDoctorAttributes,
            },
            {
              model: models.Treatments,
              as: "treatment",
              required: false,
              attributes: treatmentAttributes,
            },
            {
              model: models.Specializations,
              as: "specialization",
              required: false,
              attributes: specializationAttributes,
            },
            {
              model: models.User,
              as: "patient",
              required: false,
              attributes: patientAttributes,
            },
            // {
            //   model: models.TempUser,
            //   as: "temppatient",
            //   required: false,
            //   attributes: temppatientAttributes,
            // },
            {
              model: models.CallLogs,
              as: "logs",
              required: false,
            },
          ],
          order: [[sortBy, order]],
          offset: offset,
          limit: limit,
          where: {
            patient_uid: patientUID,
          },
        });

        const countConsultations = await models.Consultations.count({
          where: {
            patient_uid: patientUID,
          },
        });

        return {
          msg: `Find all patient consultations`,
          data: {
            consultations: find,
            offset,
            limit,
            sortBy,
            sortableColumns: sortableColumns,
            total: countConsultations,
            order,
          },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          "Failed to find consultations by patient uid: %s %s",
          error.message,
          error
        );
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },
  });
};

function unload(params) {
  const data = {
    id: params.id,
    uid: params.uid,
    patient_uid: params.patient_uid,
    status: params.status,
    permit_documents: params.permit_documents,
    preferred_schedule: params.preferred_schedule,
    duration: params.duration,
    treatment_id: params.treatment_id,
    specialization_uid: params.specialization_uid,
    patient_summary: params.patient_summary,
    is_valid: params.is_valid,
    // preferred_lang: params.preferred_lang,
    treatment: params.treatment,
    specialization: params.specialization,
    doctor: params.doctor,
    patient: params.patient,
    logs: params.logs,
    rating: params.rating,
    review: params.review,
    created_at: params.created_at,
    updated_at: params.updated_at,
    // temp_user: params.temp_user,
    // temp_patient_uid: params.temp_patient_uid,
    temppatient: params.temppatient,
    history: params.history,
    investigations: params.investigations,
    treatments: params.treatments,
    medication: params.medication,
    allergies: params.allergies,
    previous_illnesses: params.previous_illnesses,
    past_medical_history: params.past_medical_history,
    state_of_digestion: params.state_of_digestion,
    menstruation: params.menstruation,
    patient_files: params.patient_files,
    diet: params.diet,
    documents_uid: params.documents_uid
  };
  return data;
}

function load(fields) {
  // param map
  const paramsMap = {
    uid: "uid",
    patient_uid: "patient_uid",
    status: "status",
    permit_documents: "permit_documents",
    preferred_schedule: "preferred_schedule",
    duration: "duration",
    treatment_id: "treatment_id",
    specialization_uid: "specialization_uid",
    patient_summary: "patient_summary",
    is_valid: "is_valid",
    // preferred_lang: "preferred_lang",
    rating: "rating",
    review: "review",
    // temp_user: "temp_user",
    // temp_patient_uid: "temp_patient_uid",
    history: "history",
    investigations: "investigations",
    treatments: "treatments",
    medication: "medication",
    allergies: "allergies",
    previous_illnesses: "previous_illnesses",
    past_medical_history: "past_medical_history",
    state_of_digestion: "state_of_digestion",
    menstruation: "menstruation",
    patient_files: "patient_files",
    diet: "diet",
    documents_uid: "documents_uid"
  };

  let updateParams = {};

  for (const param in fields) {
    const key = paramsMap[param];
    updateParams[key] = fields[param];
  }

  return { updateParams };
}
