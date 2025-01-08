'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Medical_rate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Medical_rate.init({
    code: DataTypes.STRING,
    description: {
      type: DataTypes.STRING(1000),
      get: function () {
        const value = this.getDataValue('description');
        if (!value) {
          return value
        } else {
          return JSON.parse(value);
        }
      },
      set: function (value) {
        return this.setDataValue("description", JSON.stringify(value));
      }
    },
    charge: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Medical_rate',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'Medical_rates'
  });
  return Medical_rate;
};