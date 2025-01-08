'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Insurances", "id_front_uid", {
        allowNull: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: null,
        onDelete: 'SET NULL',
        references: {
          model: 'Documents',
          key: 'uid',
        }
      }),
      queryInterface.addColumn("Insurances", "id_back_uid", {
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
      queryInterface.removeColumn("Insurances", "id_front_uid"),
      queryInterface.removeColumn("Insurances", "id_back_uid"),
    ])
  }
};