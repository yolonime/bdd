const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const Client = require('./Client');

const Commande = sequelize.define('Commande', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    client_id: { type: DataTypes.INTEGER, allowNull: false },
    date_commande: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    tableName: 'commandes',
    timestamps: false
});

Commande.belongsTo(Client, { foreignKey: 'id' });
Client.hasMany(Commande, { foreignKey: 'id' });

module.exports = Commande;  