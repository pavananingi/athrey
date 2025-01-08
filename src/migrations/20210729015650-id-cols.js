'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Doctor_details", "id_front_url"),
      queryInterface.removeColumn("Doctor_details", "id_back_url"),
      queryInterface.addColumn("Doctor_details", "id_front_uid", {
        allowNull: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: null,
        onDelete: 'SET NULL',
        references: {
          model: 'Documents',
          key: 'uid',
        }
      }),
      queryInterface.addColumn("Doctor_details", "id_back_uid", {
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
      queryInterface.removeColumn("Doctor_details", "id_front_uid"),
      queryInterface.removeColumn("Doctor_details", "id_back_uid"),
    ])
  }
};


