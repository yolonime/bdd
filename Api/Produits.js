const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const Categorie = require('./Categorie');

const Produit = sequelize.define('Produit', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nom: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    prix: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false },
    categorie_id: { type: DataTypes.INTEGER, allowNull: true }
}, {
    tableName: 'produits',
    timestamps: false
});
// Association Produit - Categorie
Produit.belongsTo(Categorie, { foreignKey: 'id' });
Categorie.hasMany(Produit, { foreignKey: 'id' });

module.exports = Produit;