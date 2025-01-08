'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("App_plans", "price_stripe_id", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("App_plans", "metered_amount", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("App_plans", "metered_interval", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.removeColumn("App_plans", "tax_stripe_id"),
      queryInterface.removeColumn("App_plans", "tax_rate_percent"),
      queryInterface.removeColumn("App_plans", "tax_name"),
      queryInterface.removeColumn("App_plans", "tax_description"),
      queryInterface.addColumn("Subscriptions", "cancel_time", {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      }),
      queryInterface.addColumn("Subscriptions", "subitem_stripe_id", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("App_plans", "price_stripe_id"),
      queryInterface.removeColumn("App_plans", "metered_amount"),
      queryInterface.removeColumn("App_plans", "metered_interval"),
      queryInterface.removeColumn("Subscriptions", "cancel_time"),
      queryInterface.removeColumn("Subscriptions", "subitem_stripe_id")
    ])
  },
};
