const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const Client = sequelize.define('Client', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nom: { type: DataTypes.STRING, allowNull: false },
    adresse: { type: DataTypes.TEXT },
    telephone: { type: DataTypes.STRING(20) }
}, {
    tableName: 'clients',
    timestamps: false
});

module.exports = Client; 