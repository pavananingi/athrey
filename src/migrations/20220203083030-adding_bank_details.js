'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Doctor_details", "account_institution_name", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("Doctor_details", "account_holder_name", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("Doctor_details", "account_iban", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("Doctor_details", "account_bic", {
        type: Sequelize.STRING,
        allowNull: true,
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Doctor_details", "account_institution_name"),
      queryInterface.removeColumn("Doctor_details", "account_holder_name"),
      queryInterface.removeColumn("Doctor_details", "account_iban"),
      queryInterface.removeColumn("Doctor_details", "account_bic"),
    ])
  },
};
