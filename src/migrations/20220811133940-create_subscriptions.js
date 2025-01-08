'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Subscriptions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      user_uid: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: 'Users',
          key: 'uid',
          onDelete: 'cascade', // this should be in the outer scope
          onUpdate: 'cascade' // this should be in the outer scope
        }
      },
      start_date: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
      end_date: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
      active: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      sub_stripe_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      plan_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("trial", "paid"),
        allowNull: false,
        defaultValue: "trial",
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Subscriptions');
  }
};
