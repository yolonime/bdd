const express = require('express');
const mysql = require('mysql2/promise');
const fs = require('fs');
const sequelize = require('./db/config'); // Connexion Sequelize

// Importation des modèles Sequelize
const Categorie = require('./Api/Categorie');
const Produit = require('./Api/Produits');
const Client = require('./Api/Client');
const Commande = require('./Api/Commandes');
const Fournisseurs = require('./Api/Fournisseurs');
const LigneCommande = require('./Api/LigneCommande');
const ProduitFournisseur = require('./Api/ProduitFournisseurs');

const app = express();
app.use(express.json());

// Configuration MySQL pour initialisation
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    multipleStatements: true
};

// Fonction pour exécuter un fichier SQL
const executeSQLFile = async (connection, filePath) => {
    const sql = fs.readFileSync(filePath, 'utf8');
    await connection.query(sql);
    console.log(`${filePath} exécuté avec succès`);
};

// Initialisation de la base de données
const initDB = async () => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connexion à MySQL réussie');

        await executeSQLFile(connection, 'db/db.sql');
        await connection.changeUser({ database: 'GestionStock' });
        await executeSQLFile(connection, 'db/data.sql');

        console.log('Base de données initialisée avec succès');
        return connection;
    } catch (err) {
        console.error("Erreur d'initialisation de la base de données :", err);
        process.exit(1);
    }
};

// Lancement de l'initialisation de la BDD et synchronisation Sequelize
initDB().then(async () => {
    try {
        await sequelize.sync(); // Synchronisation des modèles avec la base
        console.log('Sequelize synchronisé avec succès.');

        // Routes avec Sequelize

        // Ajout d'une catégorie
        app.post('/categories', async (req, res) => {
            try {
                const { nom } = req.body;
                await Categorie.create({ nom });
                res.status(201).json({ message: 'Catégorie ajoutée avec succès' });
            } catch (error) {
                res.status(500).json({ error: "Erreur lors de l'ajout de la catégorie" });
            }
        });

        // Récupération des catégories
        app.get('/categories', async (req, res) => {
            try {
                const categories = await Categorie.findAll();
                res.json(categories);
            } catch (error) {
                res.status(500).json({ error: "Erreur lors de la récupération des catégories" });
            }
        });

        // Ajout d'un produit
        app.post('/produits', async (req, res) => {
            try {
                const { nom, description, prix, stock, categorie_id } = req.body;
                await Produit.create({ nom, description, prix, stock, categorie_id });
                res.status(201).json({ message: 'Produit ajouté avec succès' });
            } catch (error) {
                res.status(500).json({ error: "Erreur lors de l'ajout du produit" });
            }
        });

        // Récupération des produits
        app.get('/produits', async (req, res) => {
            try {
                const produits = await Produit.findAll();
                res.json(produits);
            } catch (error) {
                res.status(500).json({ error: "Erreur lors de la récupération des produits" });
            }
        });

        // Ajout d'un client
        app.post('/clients', async (req, res) => {
            try {
                const { nom, adresse, telephone } = req.body;
                await Client.create({ nom, adresse, telephone });
                res.status(201).json({ message: 'Client ajouté avec succès' });
            } catch (error) {
                res.status(500).json({ error: "Erreur lors de l'ajout du client" });
            }
        });

        // Récupération des clients
        app.get('/clients', async (req, res) => {
            try {
                const clients = await Client.findAll();
                res.json(clients);
            } catch (error) {
                res.status(500).json({ error: "Erreur lors de la récupération des clients" });
            }
        });

        // Ajout d'une commande
        app.post('/commandes', async (req, res) => {
            try {
                const { client_id } = req.body;
                await Commande.create({ client_id, date_commande: new Date() });
                res.status(201).json({ message: 'Commande enregistrée avec succès' });
            } catch (error) {
                res.status(500).json({ error: "Erreur lors de l'enregistrement de la commande" });
            }
        });

        // Lister les commandes par année
        app.get('/commandes', async (req, res) => {
            try {
                const { start, end } = req.query;
                
                if (!start || !end) {
                    return res.status(400).json({ error: 'Les paramètres start et end sont requis.' });
                }

                const commandes = await Commande.findAll({
                    where: {
                        date_commande: {
                            [sequelize.Op.between]: [new Date(start), new Date(end)],
                        },
                    },
                });

                res.json(commandes);
            } catch (error) {
                res.status(500).json({ error: "Erreur lors de la récupération des commandes" });
            }
        });


                // Ajout d'un fournisseur
        app.post('/fournisseurs', async (req, res) => {
            try {
                const { nom, adresse, telephone } = req.body;
                await Fournisseurs.create({ nom, adresse, telephone });
                res.status(201).json({ message: 'Fournisseur ajouté avec succès' });
            } catch (error) {
                res.status(500).json({ error: "Erreur lors de l'ajout du fournisseur" });
            }
        });

        // Récupération des fournisseurs
        app.get('/fournisseurs', async (req, res) => {
            try {
                const fournisseurs = await Fournisseurs.findAll();
                res.json(fournisseurs);
            } catch (error) {
                res.status(500).json({ error: "Erreur lors de la récupération des fournisseurs" });
            }
        });

        // Ajout d'une ligne de commande
        app.post('/lignecommandes', async (req, res) => {
            try {
                const { commande_id, produit_id, quantite, prix_unitaire } = req.body;
                await LigneCommande.create({ commande_id, produit_id, quantite, prix_unitaire });
                res.status(201).json({ message: 'Ligne de commande ajoutée avec succès' });
            } catch (error) {
                res.status(500).json({ error: "Erreur lors de l'ajout de la ligne de commande" });
            }
        });

        // Récupération des lignes de commande
        app.get('/lignecommandes', async (req, res) => {
            try {
                const ligneCommandes = await LigneCommande.findAll();
                res.json(ligneCommandes);
            } catch (error) {
                res.status(500).json({ error: "Erreur lors de la récupération des lignes de commande" });
            }
        });

        // Ajout d'un produit fournisseur
        app.post('/produitfournisseurs', async (req, res) => {
            try {
                const { produit_id, fournisseur_id, prix_achat } = req.body;
                await ProduitFournisseur.create({ produit_id, fournisseur_id, prix_achat });
                res.status(201).json({ message: 'Produit fournisseur ajouté avec succès' });
            } catch (error) {
                res.status(500).json({ error: "Erreur lors de l'ajout du produit fournisseur" });
            }
        });

        // Récupération des produits fournisseurs
        app.get('/produitfournisseurs', async (req, res) => {
            try {
                const produitsFournisseurs = await ProduitFournisseur.findAll();
                res.json(produitsFournisseurs);
            } catch (error) {
                res.status(500).json({ error: "Erreur lors de la récupération des produits fournisseurs" });
            }
        });

        // Rechercher les commandes d'un client
        app.get('/clients/:id/commandes', async (req, res) => {
            try {
                const { id } = req.params;

                const client = await Client.findByPk(id);
                if (!client) {
                    return res.status(404).json({ error: 'Client non trouvé' });
                }

                const commandes = await Commande.findAll({
                    where: { client_id: id },
                });

                res.json(commandes);
            } catch (error) {
                res.status(500).json({ error: "Erreur lors de la récupération des commandes du client" });
            }
        });

        // Lister les commandes qui contiennent un article précis
        app.get('/produits/:id/commandes', async (req, res) => {
            try {
                const { id } = req.params;

                const produit = await Produit.findByPk(id);
                if (!produit) {
                    return res.status(404).json({ error: 'Produit non trouvé' });
                }

                // Recherche des commandes contenant ce produit via les lignes de commande
                const commandes = await Commande.findAll({
                    include: {
                        model: LigneCommande,
                        where: { produit_id: id },
                        required: true,
                    },
                });

        res.json(commandes);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des commandes contenant ce produit" });
    }
});





        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Serveur démarré sur le port ${PORT}`);
        });
    } catch (error) {
        console.error("Erreur de synchronisation Sequelize :", error);
    }

    
});



// jeu de  test pour  l'api 
/*
localhost:3000/categories
localhost:3000/produits
localhost:3000/clients
localhost:3000/commandes
localhost:3000/commandes?start=2021-01-01&end=2021-12-31
*/