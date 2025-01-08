'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Practice_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_uid: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: 'Users',
          key: 'uid',
          // onDelete: 'cascade',
          // onUpdate: 'cascade'
        }
      },
      bsnr: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address_line_1: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      address_line_2: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      postal_code: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Practice_details');
  }
};