'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        'Users',
        'first_login',
        {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        }
      )
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([

    ])
  }
};
