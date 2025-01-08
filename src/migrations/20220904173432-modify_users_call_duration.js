'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Users", "total_call_duration", {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      }),
      queryInterface.addColumn("Users", "payable_call_duration", {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Users", "total_call_duration"),
      queryInterface.removeColumn("Users", "payable_call_duration"),
    ])
  },
};
