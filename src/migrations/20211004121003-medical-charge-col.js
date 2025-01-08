'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Consultation_doctors", "manual_invoice", {
        allowNull: true,
        type: Sequelize.STRING(1000),
        defaultValue: null
      }),
      queryInterface.addColumn("Consultation_doctors", "medical_charges", {
        allowNull: true,
        type: Sequelize.STRING(1000),
        defaultValue: null
      }),
      queryInterface.addColumn("Consultation_doctors", "medical_charges_doc_uid", {
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
      queryInterface.removeColumn("Consultation_doctors", "manual_invoice"),
      queryInterface.removeColumn("Consultation_doctors", "medical_charges"),
      queryInterface.removeColumn("Consultation_doctors", "medical_charges_doc_uid"),
    ])
  }
};
