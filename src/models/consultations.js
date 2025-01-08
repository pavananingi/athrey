"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Consultations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Consultations.hasOne(models.Treatments, {
        as: "treatment",
        foreignKey: "id",
        sourceKey: "treatment_id",
      });

      Consultations.hasOne(models.Specializations, {
        as: "specialization",
        foreignKey: "uid",
        sourceKey: "specialization_uid",
      });

      Consultations.hasOne(models.User, {
        as: "patient",
        foreignKey: "uid",
        sourceKey: "patient_uid",
      });

      // Consultations.hasOne(models.TempUser, {
      //   as: "temppatient",
      //   foreignKey: "uid",
      //   sourceKey: "temp_patient_uid",
      // });

      Consultations.hasMany(models.Consultation_doctors, {
        as: "doctor",
        foreignKey: "consultation_uid",
        sourceKey: "uid",
      });

      Consultations.hasMany(models.Call_logs, {
        as: "logs",
        foreignKey: "consultation_uid",
        sourceKey: "uid",
      });
    }
  }
  Consultations.init(
    {
      uid: DataTypes.UUID,
      patient_uid: DataTypes.UUID,
      status: DataTypes.ENUM(
        "open",
        "review",
        "scheduled",
        "completed",
        "cancelled"
      ),
      preferred_schedule: DataTypes.DATE,
      patient_summary: {
        type: DataTypes.TEXT,
        get: function () {
          const value = this.getDataValue("patient_summary");
          if (!value) {
            return value;
          } else {
            return JSON.parse(value);
          }
        },
        set: function (value) {
          return this.setDataValue("patient_summary", JSON.stringify(value));
        },
      },
      duration: DataTypes.INTEGER,
      treatment_id: DataTypes.INTEGER,
      specialization_uid: DataTypes.UUID,
      is_valid: DataTypes.BOOLEAN,
      permit_documents: DataTypes.DATE,
      rating: DataTypes.INTEGER,
      review: DataTypes.STRING,

      //new 
      history: DataTypes.STRING,
      investigations: DataTypes.STRING,
      treatments: DataTypes.STRING,
      medication: DataTypes.STRING,
      allergies: DataTypes.STRING,
      previous_illnesses: DataTypes.STRING,
      documents_uid: {
        type: DataTypes.TEXT,
        get: function () {
          const value = this.getDataValue("documents_uid");
          if (!value) {
            return value;
          } else {
            return JSON.parse(value);
          }
        },
        set: function (value) {
          return this.setDataValue("documents_uid", JSON.stringify(value));
        },
      },
      past_medical_history: {
        type: DataTypes.TEXT,
        get: function () {
          const value = this.getDataValue("past_medical_history");
          if (!value) {
            return value;
          } else {
            return JSON.parse(value);
          }
        },
        set: function (value) {
          return this.setDataValue("past_medical_history", JSON.stringify(value));
        },
      },
      state_of_digestion: {
        type: DataTypes.TEXT,
        get: function () {
          const value = this.getDataValue("state_of_digestion");
          if (!value) {
            return value;
          } else {
            return JSON.parse(value);
          }
        },
        set: function (value) {
          return this.setDataValue("state_of_digestion", JSON.stringify(value));
        },
      },
      menstruation: {
        type: DataTypes.TEXT,
        get: function () {
          const value = this.getDataValue("menstruation");
          if (!value) {
            return value;
          } else {
            return JSON.parse(value);
          }
        },
        set: function (value) {
          return this.setDataValue("menstruation", JSON.stringify(value));
        },
      },
      patient_files: {
        type: DataTypes.TEXT,
        get: function () {
          const value = this.getDataValue("patient_files");
          if (!value) {
            return value;
          } else {
            return JSON.parse(value);
          }
        },
        set: function (value) {
          return this.setDataValue("patient_files", JSON.stringify(value));
        },
      },
      diet: {
        type: DataTypes.TEXT,
        get: function () {
          const value = this.getDataValue("diet");
          if (!value) {
            return value;
          } else {
            return JSON.parse(value);
          }
        },
        set: function (value) {
          return this.setDataValue("diet", JSON.stringify(value));
        },
      },
    },
    {
      sequelize,
      modelName: "Consultations",
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "Consultations",
    }
  );
  // Consultations.removeAttribute('id');
  return Consultations;
};
