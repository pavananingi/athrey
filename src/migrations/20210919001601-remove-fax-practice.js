'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Practice_details", "fax"),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([])
  }
};


