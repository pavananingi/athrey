'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Users", "fax", {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Users", "fax"),
    ])
  }
};


