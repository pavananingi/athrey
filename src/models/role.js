'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Role.init({
    user_uid: DataTypes.STRING,
    admin: DataTypes.BOOLEAN,
    superadmin: DataTypes.BOOLEAN,
    doctor: DataTypes.BOOLEAN,
    patient: DataTypes.BOOLEAN,
    staff: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Role',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'Roles'
  });
  return Role;
}; 