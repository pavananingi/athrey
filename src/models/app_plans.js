'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class App_plans extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    } 
  };
  App_plans.init({
    plan_id: DataTypes.STRING,
    plan_stripe_id: DataTypes.STRING,
    plan_name: DataTypes.STRING,
    total_amount: DataTypes.STRING,
    base_amount: DataTypes.STRING,
    price_stripe_id: DataTypes.STRING,
    metered_amount: DataTypes.STRING,
    metered_interval: DataTypes.STRING,
    currency: DataTypes.STRING,
    plan_no_days: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'App_plans',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'App_plans'
  });
  return App_plans;
};