'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn(
        'Consultation_doctors',
        'diagnosis_path'),
      queryInterface.removeColumn(
        'Consultation_doctors',
        'leave_letter_path'),
      queryInterface.removeColumn(
        'Consultation_doctors',
        'prescription_path'),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([

    ])
  }
};
