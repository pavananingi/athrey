'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Consultations", "history", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("Consultations", "investigations", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("Consultations", "treatments", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("Consultations", "medication", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("Consultations", "allergies", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("Consultations", "previous_illnesses", {
        type: Sequelize.STRING,
        allowNull: true,
      }),

      queryInterface.addColumn("Consultations", "past_medical_history", {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
      queryInterface.addColumn("Consultations", "state_of_digestion", {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
      queryInterface.addColumn("Consultations", "menstruation", {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
      queryInterface.addColumn("Consultations", "patient_files", {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
      queryInterface.addColumn("Consultations", "diet", {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
      queryInterface.removeColumn("Consultations", "temp_patient_uid"),
      queryInterface.removeColumn("Consultations", "temp_user"),
      queryInterface.removeColumn("Consultations", "preferred_lang"),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([

    ])
  },
};
