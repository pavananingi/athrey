'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("Consultation_doctors", "manual_invoice", {
        allowNull: true,
        type: Sequelize.STRING(20000),
        defaultValue: null
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([

    ])
  }
};