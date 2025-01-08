'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Consultations", "rating", {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null
      }),
      queryInterface.addColumn("Consultations", "review", {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      }),
      queryInterface.addColumn("Consultation_doctors", "rating", {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null
      }),
      queryInterface.addColumn("Consultation_doctors", "review", {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      }),
      queryInterface.addColumn("Call_logs", "rating", {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null
      }),
      queryInterface.addColumn("Call_logs", "review", {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Consultations", "rating"),
      queryInterface.removeColumn("Consultations", "review"),
      queryInterface.removeColumn("Consultation_doctors", "rating"),
      queryInterface.removeColumn("Consultation_doctors", "review"),
      queryInterface.removeColumn("Call_logs", "rating"),
      queryInterface.removeColumn("Call_logs", "review"),
    ])
  }
};
