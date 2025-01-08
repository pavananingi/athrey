'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Practice_details", "lanr", {
        type: Sequelize.STRING,
        allowNull: true,
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Practice_details", "lanr")
    ])
  },
};