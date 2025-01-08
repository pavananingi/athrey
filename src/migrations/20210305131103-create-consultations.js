"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Consultations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uid: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
      },
      patient_uid: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
        unique: false,
        onDelete: "SET NULL",
        references: {
          model: "Users",
          key: "uid",
        },
      },
      status: {
        type: Sequelize.ENUM("open", "scheduled", "completed", "cancelled"),
        allowNull: false,
        defaultValue: "open",
      },
      preferred_schedule: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 60,
      },
      treatment_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        onDelete: "SET NULL",
        references: {
          model: "Treatments",
          key: "id",
        },
      },
      specialization_uid: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
        onDelete: "SET NULL",
        references: {
          model: "Specializations",
          key: "uid",
        },
      },
      patient_summary: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      is_valid: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      permit_documents: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      preferred_lang: {
        type: Sequelize.ARRAY(Sequelize.STRING),
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
    await queryInterface.dropTable("Consultations");
  },
};
