'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Consultation_doctors extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Consultation_doctors.hasOne(models.Consultations, {
        as: 'consultation',
        foreignKey: 'uid',
        sourceKey: 'consultation_uid',
      });

      Consultation_doctors.hasOne(models.User, {
        as: 'profile',
        foreignKey: 'uid',
        sourceKey: 'doctor_uid',
      });

      Consultation_doctors.hasOne(models.User, {
        as: 'doctor',
        foreignKey: 'uid',
        sourceKey: 'doctor_uid',
      });

      Consultation_doctors.hasOne(models.Doctor_detail, {
        as: 'professional',
        foreignKey: 'user_uid',
        sourceKey: 'doctor_uid'
      })

      Consultation_doctors.hasOne(models.Document, {
        as: 'diagnosis_document',
        foreignKey: 'uid',
        sourceKey: 'diagnosis_doc_uid'
      })

    }
  };
  Consultation_doctors.init({
    consultation_uid: DataTypes.UUID,
    doctor_uid: DataTypes.UUID,
    confirmed_schedule: DataTypes.DATE,
    duration: DataTypes.INTEGER,
    notes: DataTypes.STRING(500),
    status: DataTypes.ENUM('scheduled', 'review', 'completed', 'cancelled'),
    leave_letter: {
      type: DataTypes.STRING(4000),
      get: function () {
        const value = this.getDataValue('leave_letter');
        if (!value) {
          return value
        } else {
          return JSON.parse(value);
        }
      },
      set: function (value) {
        return this.setDataValue("leave_letter", JSON.stringify(value));
      }
    },
    prescription: {
      type: DataTypes.STRING(4000),
      get: function () {
        const value = this.getDataValue('prescription');
        if (!value) {
          return value
        } else {
          return JSON.parse(value);
        }
      },
      set: function (value) {
        return this.setDataValue("prescription", JSON.stringify(value));
      }
    },
    diagnosis: {
      type: DataTypes.STRING(1000),
      get: function () {
        const value = this.getDataValue('diagnosis');
        if (!value) {
          return value
        } else {
          return JSON.parse(value);
        }
      },
      set: function (value) {
        return this.setDataValue("diagnosis", JSON.stringify(value));
      }
    },
    manual_invoice: {
      type: DataTypes.STRING(20000),
      get: function () {
        const value = this.getDataValue('manual_invoice');
        if (!value) {
          return value
        } else {
          return JSON.parse(value);
        }
      },
      set: function (value) {
        return this.setDataValue("manual_invoice", JSON.stringify(value));
      }
    },
    medical_charges: {
      type: DataTypes.STRING(20000),
      get: function () {
        const value = this.getDataValue('medical_charges');
        if (!value) {
          return value
        } else {
          return JSON.parse(value);
        }
      },
      set: function (value) {
        return this.setDataValue("medical_charges", JSON.stringify(value));
      }
    },
    leave_letter_doc_uid: {
      type: DataTypes.STRING(1000),
      get: function () {
        const value = this.getDataValue('leave_letter_doc_uid');
        if (!value) {
          return value
        } else {
          return JSON.parse(value);
        }
      },
      set: function (value) {
        return this.setDataValue("leave_letter_doc_uid", JSON.stringify(value));
      }
    },
    diagnosis_doc_uid: DataTypes.UUID,
    invoices_doc_uid: DataTypes.UUID,
    medical_charges_doc_uid: DataTypes.UUID,
    prescription_doc_uid: DataTypes.UUID,
    rating: DataTypes.INTEGER,
    review: DataTypes.STRING,
    invoice_id: DataTypes.STRING,
    invoice_status: DataTypes.ENUM('draft', 'open', 'paid', 'uncollectible', 'void'),
    comments: DataTypes.STRING(1000),
  }, {
    sequelize,
    modelName: 'Consultation_doctors',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'Consultation_doctors'
  });
  // Consultation_doctors.removeAttribute('id');
  return Consultation_doctors;
};