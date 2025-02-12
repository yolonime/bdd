const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('GestionStock', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // Désactiver les logs SQL
});

module.exports = sequelize;