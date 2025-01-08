'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Practice_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Practice_detail.init({
    user_uid: DataTypes.UUID,
    address_line_1: DataTypes.STRING,
    address_line_2: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    postal_code: DataTypes.INTEGER,
    country_code: DataTypes.STRING(10),
    country: DataTypes.STRING,
    bsnr: DataTypes.STRING,
    lanr: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    telephone: DataTypes.STRING,
    website: DataTypes.STRING,
    kbv: DataTypes.STRING,
    association: DataTypes.STRING,
    registration_no: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Practice_detail',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'Practice_details'
  });
  return Practice_detail;
};