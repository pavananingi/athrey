"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TempUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TempUser.init(
    {
      uid: DataTypes.UUID,
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      email: DataTypes.STRING,
      consent: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "TempUser",
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "TempUsers",
    }
  );
  // User.removeAttribute('id');
  return TempUser;
};
