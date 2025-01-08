'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Call_logs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Call_logs.hasMany(models.Consultation_doctors, {
        as: 'logs',
        foreignKey: 'consultation_uid',
        sourceKey: 'consultation_uid'
      });

    }
  };
  Call_logs.init({
    consultation_uid: DataTypes.UUID,
    doctor_name: DataTypes.STRING,
    patient_name: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    start_time: DataTypes.DATE,
    end_time: DataTypes.DATE,
    conversation_id: DataTypes.STRING,
    media_type: DataTypes.STRING,
    disconnect_reason: DataTypes.STRING,
    disconnect_type: DataTypes.STRING,
    invite_type: DataTypes.ENUM('INCOMING', 'OUTGOING'),
    rating: DataTypes.INTEGER,
    review: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Call_logs',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'Call_logs'
  });
  return Call_logs;
};