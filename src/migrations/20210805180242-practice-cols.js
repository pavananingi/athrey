'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Practice_details", "name", {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
      }),
      queryInterface.addColumn("Practice_details", "email", {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
      }),
      queryInterface.addColumn("Practice_details", "phone", {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
      }),
      queryInterface.addColumn("Practice_details", "fax", {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
      }),
      queryInterface.addColumn("Practice_details", "website", {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
      }),
      queryInterface.addColumn("Practice_details", "kbv", {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
      }),
      queryInterface.addColumn("Practice_details", "association", {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
      }),

    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Practice_details", "name"),
      queryInterface.removeColumn("Practice_details", "email"),
      queryInterface.removeColumn("Practice_details", "phone"),
      queryInterface.removeColumn("Practice_details", "fax"),
      queryInterface.removeColumn("Practice_details", "website"),
      queryInterface.removeColumn("Practice_details", "kbv"),
      queryInterface.removeColumn("Practice_details", "association"),
    ])
  }
};


