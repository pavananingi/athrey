'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Practice_details", "registration_no", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("Practice_details", "country_code", {
        allowNull: true,
        type: Sequelize.STRING(10),
        defaultValue: null
      }),
      queryInterface.addColumn("Users", "id_cirtificate_uid", {
        type: Sequelize.STRING,
        allowNull: true,
      },),
      queryInterface.addColumn("Consultations", "documents_uid", {
        type: Sequelize.STRING,
        allowNull: true,
      },),
      queryInterface.addColumn("Doctor_details", "id_photo_uid", {
        type: Sequelize.STRING,
        allowNull: true,
      },),
      queryInterface.changeColumn("Documents", "user_uid", {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
        unique: false,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'uid',
        }
      },),
      queryInterface.addColumn("Users", "status", {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "approved",
      },),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([

    ])
  },
};
