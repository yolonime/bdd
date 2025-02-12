const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const Fournisseur = sequelize.define('Fournisseur', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nom: { type: DataTypes.STRING, allowNull: false },
    adresse: { type: DataTypes.TEXT },
    telephone: { type: DataTypes.STRING(20) }
}, {
    tableName: 'fournisseurs',
    timestamps: false
});

module.exports = Fournisseur;
