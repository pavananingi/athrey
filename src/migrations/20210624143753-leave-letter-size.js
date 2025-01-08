'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        'Consultation_doctors',
        'leave_letter',
        {
          type: Sequelize.STRING(4000),
          defaultValue: null
        }
      )
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([

    ])
  }
};
