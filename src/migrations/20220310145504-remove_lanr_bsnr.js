'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Doctor_details", "lanr"),
      queryInterface.removeColumn("Doctor_details", "bsnr")
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      // queryInterface.removeColumn("Doctor_details", "lanr")
    ])
  },
};