'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Doctor_details', {
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
      specialization: {
        type: Sequelize.ARRAY(Sequelize.STRING(500)),
        allowNull: false,
        defaultValue: []
      },
      biography: {
        type: Sequelize.STRING(500),
        allowNull: true,
        defaultValue: null
      },
      qualification: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'MBBS'
      },
      experience: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      lanr: {
        type: Sequelize.STRING,
        allowNull: false
      },
      bsnr: {
        type: Sequelize.STRING,
        allowNull: false
      },
      id_front_url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      id_back_url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      verification_status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      verified_by: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      verified_on: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('Doctor_details');
  }
};