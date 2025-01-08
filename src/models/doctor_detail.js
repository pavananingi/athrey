'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Doctor_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Doctor_detail.hasOne(models.Document, {
        as: 'id_front_document',
        foreignKey: 'uid',
        sourceKey: 'id_front_uid'
      })

      Doctor_detail.hasOne(models.Document, {
        as: 'id_back_document',
        foreignKey: 'uid',
        sourceKey: 'id_back_uid'
      })
    }
  };
  Doctor_detail.init({
    user_uid: DataTypes.UUID,
    specialization: DataTypes.ARRAY(DataTypes.STRING),
    biography: DataTypes.STRING(500),
    qualification: DataTypes.STRING,
    experience: DataTypes.INTEGER,
    id_front_uid: DataTypes.UUID,
    id_back_uid: DataTypes.UUID,
    id_photo_uid: DataTypes.STRING,
    verification_status: DataTypes.BOOLEAN,
    verified_by: DataTypes.STRING,
    verified_on: DataTypes.DATE,
    account_institution_name: DataTypes.STRING,
    account_holder_name: DataTypes.STRING,
    account_iban: DataTypes.STRING(22),
    account_bic: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Doctor_detail',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'Doctor_details'
  });
  return Doctor_detail;
};