'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query(`ALTER TYPE "enum_Consultations_status" ADD VALUE 'review'`),
      queryInterface.sequelize.query(`ALTER TYPE "enum_Consultation_doctors_status" ADD VALUE 'review'`)
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([])
  }
};