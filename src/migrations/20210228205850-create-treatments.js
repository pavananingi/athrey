'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Treatments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      category_uid: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
        unique: false,
        onDelete: 'SET NULL',
        // onUpdate: 'CASCADE'
        references: {
          model: 'Treatment_categories',
          key: 'uid',
        }
      },
      treatment: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      illustration_url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      questions: {
        type: Sequelize.STRING(1000),
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
    await queryInterface.dropTable('Treatments');
  }
};