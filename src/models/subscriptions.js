'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Subscriptions extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Subscriptions.init({
        user_uid: DataTypes.UUID,
        start_date: DataTypes.DATE,
        end_date: DataTypes.DATE,
        active: DataTypes.BOOLEAN,
        sub_stripe_id: DataTypes.STRING,
        plan_id: DataTypes.STRING,
        status: DataTypes.ENUM('trial', 'paid'),
        cancel_time: DataTypes.DATE,
        subitem_stripe_id: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Subscriptions',
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        tableName: 'Subscriptions'
    });
    return Subscriptions;
};