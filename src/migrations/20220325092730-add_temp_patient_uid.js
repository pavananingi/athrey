"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Consultations", "temp_patient_uid", {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
        unique: false,
        onDelete: "SET NULL",
        references: {
          model: "TempUsers",
          key: "uid",
        },
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Consultations", "temp_patient_uid"),
    ]);
  },
};
