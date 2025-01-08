'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Call_logs", "invite_type", {
        allowNull: true,
        type: Sequelize.ENUM('INCOMING', 'OUTGOING'),
        defaultValue: null
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Call_logs", "invite_type"),
    ])
  }
};
