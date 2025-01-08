'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Insurances', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      uid: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      user_uid: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        unique: false,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'uid',
        }
      },
      provider: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      branch_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      insurance_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      valid_till: {
        defaultValue: null,
        allowNull: true,
        type: Sequelize.DATEONLY,
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
    await queryInterface.dropTable('Insurances');
  }
};