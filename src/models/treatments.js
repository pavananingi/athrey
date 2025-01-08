'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Treatments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Treatments.hasOne(models.Treatment_categories, {
        as: 'category',
        foreignKey: 'uid',
        sourceKey: 'category_uid',
      })
    }
  };
  Treatments.init({
    category_uid: DataTypes.UUID,
    treatment: {
      type: DataTypes.STRING,
      get: function () {
        const value = this.getDataValue('treatment');
        if (!value) {
          return value
        } else {
          return JSON.parse(value);
        }
      },
      set: function (value) {
        return this.setDataValue("treatment", JSON.stringify(value));
      }
    },
    illustration_url: DataTypes.STRING,
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
    modelName: 'Treatments',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'Treatments'
  });
  return Treatments;
};