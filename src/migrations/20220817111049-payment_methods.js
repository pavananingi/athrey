'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Payment_Methods', {
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
      method_stripe_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cus_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      method: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      last_digits: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bankcode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      branchcode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fingerprint: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      mandate_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      mandate_ip: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      postal: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      migrated: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      next_invoice: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      next_invoice_amount: {
        type: Sequelize.STRING,
        allowNull: true,
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
    return queryInterface.dropTable('Payment_Methods');
  }
};
