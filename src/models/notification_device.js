'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification_device extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Notification_device.hasOne(models.User, {
        as: 'user',
        foreignKey: 'uid',
        sourceKey: 'user_uid',
      });
    }
  };
  Notification_device.init({
    user_uid: DataTypes.UUID,
    device_name: DataTypes.STRING,
    device_id: DataTypes.STRING,
    notification_id: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Notification_device',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'Notification_devices'
  });
  return Notification_device;
};