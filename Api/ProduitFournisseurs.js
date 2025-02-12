const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const Produit = require('./Produits');
const Fournisseur = require('./Fournisseurs');

const ProduitFournisseur = sequelize.define('ProduitFournisseur', {}, {
    tableName: 'produits_fournisseurs',
    timestamps: false
});

Produit.belongsToMany(Fournisseur, { through: ProduitFournisseur, foreignKey: 'id' });
Fournisseur.belongsToMany(Produit, { through: ProduitFournisseur, foreignKey: 'id' });

module.exports = ProduitFournisseur;