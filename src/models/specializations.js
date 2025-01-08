'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Specializations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Specializations.init({
    uid: DataTypes.UUID,
    illustration_url: DataTypes.STRING,
    specialization: {
      type: DataTypes.STRING,
      get: function () {
        const value = this.getDataValue('specialization');
        if (!value) {
          return value
        } else {
          return JSON.parse(value);
        }
      },
      set: function (value) {
        return this.setDataValue("specialization", JSON.stringify(value));
      }
    },
    description: {
      type: DataTypes.STRING,
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
    questions: {
      type: DataTypes.STRING,
      get: function () {
        const value = this.getDataValue('questions');
        if (!value) {
          return value
        } else {
          return JSON.parse(value);
        }
      },
      set: function (value) {
        return this.setDataValue("questions", JSON.stringify(value));
      }
    },
  }, {
    sequelize,
    modelName: 'Specializations',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'Specializations'
  });
  // Specializations.removeAttribute('id');
  return Specializations;
};