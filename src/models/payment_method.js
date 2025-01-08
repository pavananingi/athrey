'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Payment_Methods extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Payment_Methods.init({
        user_uid: DataTypes.INTEGER,
        method_stripe_id: DataTypes.STRING,
        cus_id: DataTypes.STRING,
        method: DataTypes.STRING,
        iban: DataTypes.STRING,
        last_digits: DataTypes.STRING,
        bankcode: DataTypes.STRING,
        branchcode: DataTypes.STRING,
        country: DataTypes.STRING,
        fingerprint: DataTypes.STRING,
        mandate_id: DataTypes.INTEGER,
        mandate_ip: DataTypes.STRING,
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        address: DataTypes.STRING,
        postal: DataTypes.STRING,
        city: DataTypes.STRING,
        migrated: DataTypes.BOOLEAN,
        next_invoice: DataTypes.DATE,
        next_invoice_amount: DataTypes.STRING,
        status: DataTypes.ENUM('proccessing', 'succeed')
    }, {
        sequelize,
        modelName: 'Payment_Methods',
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        tableName: 'Payment_Methods'
    });
    return Payment_Methods;
};