'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Documents", "deleted", {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }),
      queryInterface.addColumn("Documents", "deleted_on", {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Documents", "deleted"),
      queryInterface.removeColumn("Documents", "deleted_on"),
    ])
  }
};