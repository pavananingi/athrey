'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Users", "fax"),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([])
  }
};


