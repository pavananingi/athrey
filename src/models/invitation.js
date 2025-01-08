'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invitation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Invitation.init({
    uid: DataTypes.UUID,
    salute: DataTypes.ENUM('Mr.', 'Mrs.'),
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    role: DataTypes.ENUM('doctor', 'patient', 'staff', 'admin', 'superadmin')
  }, {
    sequelize,
    modelName: 'Invitation',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'Invitations'
  });
  return Invitation;
};