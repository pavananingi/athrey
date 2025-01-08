'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Consultation_doctors", "invoices_doc_uid", {
        allowNull: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: null,
        onDelete: 'SET NULL',
        references: {
          model: 'Documents',
          key: 'uid',
        }
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Consultation_doctors", "invoices_doc_uid"),
    ])
  }
};
