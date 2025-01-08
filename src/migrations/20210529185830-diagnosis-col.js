'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Consultation_doctors", "diagnosis", {
        allowNull: true,
        type: Sequelize.STRING(1000),
        defaultValue: null
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Consultation_doctors", "diagnosis"),
    ])
  }
};
