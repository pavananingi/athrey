'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Role, {
        as: 'roles',
        foreignKey: 'user_uid',
        sourceKey: 'uid',
      });
      User.hasOne(models.Subscriptions, {
        as: 'subscriptions',
        foreignKey: 'user_uid',
        sourceKey: 'uid',
      });
      User.hasOne(models.Payment_Methods, {
        as: 'paymentMethods',
        foreignKey: 'user_uid',
        sourceKey: 'uid',
      });
    }
  };
  User.init({
    uid: DataTypes.UUID,
    salute: DataTypes.ENUM('Mr.', 'Mrs.'),
    title: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    avatar_url: DataTypes.STRING,
    dob: DataTypes.DATEONLY,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    country_code: DataTypes.STRING(10),
    id_cirtificate_uid: DataTypes.STRING,
    phone: DataTypes.STRING,
    customer_id: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    status: DataTypes.STRING, //approved, pending, declined
    force_reset_password: DataTypes.BOOLEAN,
    email_verified: DataTypes.BOOLEAN,
    phone_verified: DataTypes.BOOLEAN,
    // address_line_1: DataTypes.STRING,
    // address_line_2: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    postal_code: DataTypes.INTEGER,
    country: DataTypes.STRING,
    // lanugage: DataTypes.ENUM('en', 'de'),
    invalid_attempts: DataTypes.INTEGER,
    first_login: DataTypes.BOOLEAN,
    telephone: DataTypes.STRING,
    total_call_duration: DataTypes.INTEGER,
    payable_call_duration: DataTypes.INTEGER,
    guardian: DataTypes.STRING,
    height: DataTypes.STRING,
    weight: DataTypes.STRING,
    structure: DataTypes.STRING,
    address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'Users'
  });
  // User.removeAttribute('id');
  return User;
};