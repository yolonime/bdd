// Importation des modules nécessaires
const express = require('express');
const mysql = require('mysql2/promise');
const fs = require('fs');

const app = express();
// Middleware pour parser les corps de requêtes en JSON
app.use(express.json());

// Configuration de la connexion à la base de données
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '', // <<-- FAIBLE : mot de passe vide en environnement de production
    multipleStatements: true
};

// Fonction pour exécuter un fichier SQL
const executeSQLFile = async (connection, filePath) => {
    // Lecture synchrone du fichier SQL (bloquant)
    const sql = fs.readFileSync(filePath, 'utf8');
    await connection.query(sql);
    console.log(`${filePath} exécuté avec succès`);
};

// Initialisation de la base de données
const initDB = async () => {
    try {
        // Établissement de la connexion à MySQL
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connexion à MySQL réussie');

        // Exécution d'un script SQL (par exemple, pour créer la base ou les tables)
        await executeSQLFile(connection, 'db.sql');

        // Changement de base de données
        await connection.changeUser({ database: 'GestionStock' });

        // Insertion des données initiales
        await executeSQLFile(connection, 'data.sql');

        console.log('Base de données initialisée avec succès');
        return connection;
    } catch (err) {
        console.error('Erreur lors de l\'initialisation de la base de données :', err);
        process.exit(1); // Arrête le processus en cas d'erreur
    }
};

// Lancement de l'initialisation de la BDD et démarrage du serveur dès que la connexion est établie
initDB().then(connection => {
    
    // Route pour ajouter une catégorie
    app.post('/categories', async (req, res) => {
        try {
            const { nom } = req.body;
            // Utilisation de requêtes paramétrées pour prévenir les injections SQL
            const sql = 'INSERT INTO Categories (nom) VALUES (?)';
            await connection.execute(sql, [nom]);
            res.status(201).json({ message: 'Catégorie ajoutée avec succès' });
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de l ajout de la catégorie' });
        }
    });

    // Route pour récupérer toutes les catégories
    app.get('/categories', async (req, res) => {
        try {
            const [result] = await connection.execute('SELECT * FROM Categories');
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération des catégories' });
        }
    });

    // Route pour ajouter un produit
    app.post('/produits', async (req, res) => {
        try {
            const { nom, description, prix, stock, categorie_id } = req.body;
            const sql = 'INSERT INTO Produits (nom, description, prix, stock, categorie_id) VALUES (?, ?, ?, ?, ?)';
            await connection.execute(sql, [nom, description, prix, stock, categorie_id]);
            res.status(201).json({ message: 'Produit ajouté avec succès' });
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de l ajout du produit' });
        }
    });

    // Route pour récupérer tous les produits
    app.get('/produits', async (req, res) => {
        try {
            const [result] = await connection.execute('SELECT * FROM Produits');
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
        }
    });

    // Route pour ajouter un client
    app.post('/clients', async (req, res) => {
        try {
            const { nom, adresse, telephone } = req.body;
            const sql = 'INSERT INTO Clients (nom, adresse, telephone) VALUES (?, ?, ?)';
            await connection.execute(sql, [nom, adresse, telephone]);
            res.status(201).json({ message: 'Client ajouté avec succès' });
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de l ajout du client' });
        }
    });

    // Route pour récupérer tous les clients
    app.get('/clients', async (req, res) => {
        try {
            const [result] = await connection.execute('SELECT * FROM Clients');
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération des clients' });
        }
    });

    // Route pour ajouter une commande
    app.post('/commandes', async (req, res) => {
        try {
            const { client_id } = req.body;
            // Insertion de la commande avec la date actuelle
            const sql = 'INSERT INTO Commandes (client_id, date_commande) VALUES (?, NOW())';
            await connection.execute(sql, [client_id]);
            res.status(201).json({ message: 'Commande enregistrée avec succès' });
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de l enregistrement de la commande' });
        }
    });

    // Route pour récupérer toutes les commandes
    app.get('/commandes', async (req, res) => {
        try {
            const [result] = await connection.execute('SELECT * FROM Commandes');
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
        }
    });

    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Serveur démarré sur le port ${PORT}`);
    });
}).catch(error => {
    console.error('Erreur de connexion à la base de données:', error);
});
