'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Call_logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      consultation_uid: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        unique: false,
        onDelete: 'CASCADE',
        references: {
          model: 'Consultations',
          key: 'uid',
        }
      },
      doctor_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      patient_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: '0'
      },
      start_time: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end_time: {
        type: Sequelize.DATE,
        allowNull: false
      },
      conversation_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      media_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      disconnect_reason: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      disconnect_type: {
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
    await queryInterface.dropTable('Call_logs');
  }
};