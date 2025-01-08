"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ipaddress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Ipaddress.init(
    {
      address: DataTypes.STRING,
      invalidtry: DataTypes.INTEGER,
      validtry_time: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Ipaddress",
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "Ipaddresses",
    }
  );
  return Ipaddress;
};
