'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Insurance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Insurance.init({
    uid: DataTypes.UUID,
    user_uid: DataTypes.UUID,
    provider: DataTypes.STRING,
    branch_code: DataTypes.STRING,
    insurance_code: DataTypes.STRING,
    valid_till: DataTypes.DATEONLY,
    id_front_uid: DataTypes.UUID,
    id_back_uid: DataTypes.UUID,
  }, {
    sequelize,
    modelName: 'Insurance',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'Insurances'
  });
  return Insurance;
};