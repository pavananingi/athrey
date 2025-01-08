'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Treatment_categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Treatment_categories.hasMany(models.Treatments, {
        as: 'treatments',
        foreignKey: 'category_uid',
        sourceKey: 'uid'
      })
    }
  };
  Treatment_categories.init({
    uid: DataTypes.UUID,
    category: {
      type: DataTypes.STRING,
      get: function () {
        const value = this.getDataValue('category');
        if (!value) {
          return value
        } else {
          return JSON.parse(value);
        }
      },
      set: function (value) {
        return this.setDataValue("category", JSON.stringify(value));
      }
    },
  }, {
    sequelize,
    modelName: 'Treatment_categories',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'Treatment_categories'
  });
  // Treatment_categories.removeAttribute('id');
  return Treatment_categories;
};