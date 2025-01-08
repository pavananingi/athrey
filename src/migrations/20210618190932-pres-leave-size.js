'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        'Consultation_doctors',
        'prescription',
        {
          type: Sequelize.STRING(1000),
          allowNull: true
        }
      ),
      queryInterface.changeColumn(
        'Consultation_doctors',
        'leave_letter',
        {
          type: Sequelize.STRING(1000),
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
