const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const Categorie = sequelize.define('Categorie', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nom: { type: DataTypes.STRING, allowNull: false }
}, {
    tableName: 'categories',
    timestamps: false
});

module.exports = Categorie;