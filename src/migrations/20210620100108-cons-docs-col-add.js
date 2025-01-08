'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Consultation_doctors", "diagnosis_doc_uid", {
        allowNull: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: null,
        onDelete: 'SET NULL',
        references: {
          model: 'Documents',
          key: 'uid',
        }
      }),
      queryInterface.addColumn("Consultation_doctors", "leave_letter_doc_uid", {
        allowNull: true,
        type: Sequelize.DataTypes.STRING(1000),
        defaultValue: null,
      }),
      queryInterface.addColumn("Consultation_doctors", "prescription_doc_uid", {
        allowNull: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: null,
        onDelete: 'SET NULL',
        references: {
          model: 'Documents',
          key: 'uid',
        }
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Consultation_doctors", "diagnosis_doc_uid"),
      queryInterface.removeColumn("Consultation_doctors", "leave_letter_doc_uid"),
      queryInterface.removeColumn("Consultation_doctors", "prescription_doc_uid"),
    ])
  }
};
