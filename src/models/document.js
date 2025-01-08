'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Document.init({
    uid: DataTypes.UUID,
    user_uid: DataTypes.UUID,
    url: DataTypes.STRING,
    name: DataTypes.STRING,
    deleted: DataTypes.BOOLEAN,
    deleted_on: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Document',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'Documents'
  });
  // Document.removeAttribute('id');
  return Document;
};

