'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('App_plans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      plan_id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      plan_stripe_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      plan_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      total_amount: {
        type: Sequelize.STRING,
        allowNull: false
      },
      base_amount: {
        type: Sequelize.STRING,
        allowNull: false
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tax_stripe_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tax_rate_percent: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      tax_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tax_description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      plan_no_days: {
        allowNull: false,
        defaultValue: 1,
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('App_plans');
  }
};
