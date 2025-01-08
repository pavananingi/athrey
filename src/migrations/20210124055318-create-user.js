"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    );
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: false,
        type: Sequelize.INTEGER,
      },
      uid: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
      },
      salute: {
        type: Sequelize.ENUM("Mr.", "Mrs."),
        allowNull: false,
        defaultValue: "Mr.",
      },
      title: {
        type: Sequelize.ENUM("Dr. med", "Prof. Dr. med"),
        allowNull: true,
        defaultValue: null,
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      avatar_url: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "default.png",
      },
      dob: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: "1900-01-01",
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      customer_id: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      force_reset_password: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      email_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      phone_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      // address_line_1: {
      //   type: Sequelize.STRING,
      //   allowNull: true,
      //   defaultValue: null,
      // },
      // address_line_2: {
      //   type: Sequelize.STRING,
      //   allowNull: true,
      //   defaultValue: null,
      // },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      postal_code: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      invalid_attempts: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      // lanugage: {
      //   type: Sequelize.ENUM("en", "de"),
      //   allowNull: false,
      //   defaultValue: "de",
      // },
      guardian: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      height: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      weight: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      structure: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Users");
  },
};
