'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Notification_devices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_uid: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        unique: false,
        references: {
          model: 'Users',
          key: 'uid',
          // onDelete: 'cascade',
          // onUpdate: 'cascade'
        }
      },
      device_name: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      device_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      notification_id: {
        type: Sequelize.STRING,
        allowNull: false
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
    await queryInterface.dropTable('Notification_devices');
  }
};