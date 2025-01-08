'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        'Call_logs',
        'conversation_id',
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      ),
      queryInterface.changeColumn(
        'Call_logs',
        'media_type',
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      ),
      queryInterface.changeColumn(
        'Call_logs',
        'disconnect_reason',
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      ),
      queryInterface.changeColumn(
        'Call_logs',
        'disconnect_type',
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      )
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([

    ])
  }
};
