'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Consultation_doctors", "invoice_id", {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
      }),
      queryInterface.addColumn("Consultation_doctors", "invoice_status", {
        allowNull: true,
        type: Sequelize.ENUM('draft', 'open', 'paid', 'uncollectible', 'void'),
        defaultValue: null,
      }),
      queryInterface.addColumn("Consultation_doctors", "comments", {
        allowNull: true,
        type: Sequelize.DataTypes.STRING(1000),
        defaultValue: null,
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Consultation_doctors", "invoice_id"),
      queryInterface.removeColumn("Consultation_doctors", "invoice_status"),
      queryInterface.removeColumn("Consultation_doctors", "comments"),
    ])
  }
};


