'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Payment_Methods", "status", {
        type: Sequelize.STRING,
        allowNull: true,
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Payment_Methods", "status")
    ])
  },
};
