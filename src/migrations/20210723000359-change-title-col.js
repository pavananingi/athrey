'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        'Users',
        'title',
        {
          type: Sequelize.STRING
        }
      )
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([

    ])
  }
};