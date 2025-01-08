'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Users", "country_code", {
        allowNull: true,
        type: Sequelize.STRING(10),
        defaultValue: null
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Users", "country_code"),
    ])
  }
};
