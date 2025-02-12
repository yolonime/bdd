const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const Commande = require('./Commandes');
const Produit = require('./Produits');

const LigneCommande = sequelize.define('LigneCommande', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    commande_id: { type: DataTypes.INTEGER, allowNull: false },
    produit_id: { type: DataTypes.INTEGER, allowNull: false },
    quantite: { type: DataTypes.INTEGER, allowNull: false },
    prix_unitaire: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, {
    tableName: 'lignes_commande',
    timestamps: false
});

LigneCommande.belongsTo(Commande, { foreignKey: 'id' });
LigneCommande.belongsTo(Produit, { foreignKey: 'id' });
Commande.hasMany(LigneCommande, { foreignKey: 'id' });
Produit.hasMany(LigneCommande, { foreignKey: 'id' });

module.exports = LigneCommande;

