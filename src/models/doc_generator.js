'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Doc_generators extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Doc_generators.init({
    uid: DataTypes.UUID,
    consultation: {
      type: DataTypes.STRING,
      get: function () {
        const value = this.getDataValue('consultation');
        if (!value) {
          return value
        } else {
          return JSON.parse(value);
        }
      },
      set: function (value) {
        return this.setDataValue("consultation", JSON.stringify(value));
      }
    },
    type: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'docGenerator',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'docGenerators'
  });
  return Doc_generators;
};