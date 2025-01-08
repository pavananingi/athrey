'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Documents', {
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
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.dropTable('Documents');
  }
};