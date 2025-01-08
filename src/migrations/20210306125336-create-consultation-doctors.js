'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Consultation_doctors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      consultation_uid: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
        unique: false,
        onDelete: 'SET NULL',
        references: {
          model: 'Consultations',
          key: 'uid',
        }
      },
      doctor_uid: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
        unique: false,
        onDelete: 'SET NULL',
        references: {
          model: 'Users',
          key: 'uid',
        }
      },
      confirmed_schedule: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: '10'
      },
      notes: {
        type: Sequelize.STRING(500),
        allowNull: true,
        defaultValue: null
      },
      status: {
        type: Sequelize.ENUM('scheduled', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'scheduled'
      },
      leave_letter: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      },
      prescription: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
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
    await queryInterface.dropTable('Consultation_doctors');
  }
};