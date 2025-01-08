'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query(`ALTER TYPE "enum_Users_salute" ADD VALUE 'other'`),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([])
  }
};