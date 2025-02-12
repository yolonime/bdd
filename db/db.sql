DROP DATABASE IF EXISTS GestionStock;
CREATE DATABASE GestionStock;
USE GestionStock;

-- Table des catégories de produits
CREATE TABLE Categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL
);

-- Table des fournisseurs
CREATE TABLE Fournisseurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    adresse TEXT,
    telephone VARCHAR(20)
);

-- Table des produits
CREATE TABLE Produits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    prix DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    categorie_id INT,
    FOREIGN KEY (categorie_id) REFERENCES Categories(id)
);

-- Table de liaison entre les produits et les fournisseurs (relation plusieurs-à-plusieurs)
CREATE TABLE Produits_Fournisseurs (
    produit_id INT,
    fournisseur_id INT,
    PRIMARY KEY (produit_id, fournisseur_id),
    FOREIGN KEY (produit_id) REFERENCES Produits(id),
    FOREIGN KEY (fournisseur_id) REFERENCES Fournisseurs(id)
);

-- Table des clients
CREATE TABLE Clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    adresse TEXT,
    telephone VARCHAR(20)
);

-- Table des commandes
CREATE TABLE Commandes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT,
    date_commande DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES Clients(id)
);

-- Table des lignes de commande (produits commandés)
CREATE TABLE Lignes_Commande (
    id INT AUTO_INCREMENT PRIMARY KEY,
    commande_id INT,
    produit_id INT,
    quantite INT NOT NULL,
    prix_unitaire DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (commande_id) REFERENCES Commandes(id),
    FOREIGN KEY (produit_id) REFERENCES Produits(id)
);







CREATE PROCEDURE RechercheCommandes(
    IN p_client_id INT,
    IN p_start_date DATE,
    IN p_end_date DATE,
    IN p_statut VARCHAR(255),
    IN p_produit_id INT
)
BEGIN
    SELECT c.*
    FROM Commandes c
    LEFT JOIN LigneCommande lc ON c.id = lc.commande_id
    LEFT JOIN Produits p ON lc.produit_id = p.id
    WHERE 
        (p_client_id IS NULL OR c.client_id = p_client_id) AND
        (p_start_date IS NULL OR c.date_commande >= p_start_date) AND
        (p_end_date IS NULL OR c.date_commande <= p_end_date) AND
        (p_statut IS NULL OR c.statut = p_statut) AND
        (p_produit_id IS NULL OR p.id = p_produit_id);
END ;






CREATE PROCEDURE StatistiquesVentes(
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    -- Total des ventes
    SELECT SUM(lc.prix_unitaire * lc.quantite) AS total_ventes
    FROM LigneCommande lc
    JOIN Commandes c ON lc.commande_id = c.id
    WHERE c.date_commande BETWEEN p_start_date AND p_end_date;

    -- Produits les plus vendus
    SELECT p.nom AS produit, SUM(lc.quantite) AS quantite_vendue
    FROM LigneCommande lc
    JOIN Produits p ON lc.produit_id = p.id
    JOIN Commandes c ON lc.commande_id = c.id
    WHERE c.date_commande BETWEEN p_start_date AND p_end_date
    GROUP BY p.id
    ORDER BY quantite_vendue DESC;
END ;






CREATE PROCEDURE GererStock(
    IN p_produit_id INT,
    IN p_quantite INT
)
BEGIN
    DECLARE v_stock INT;

    -- Vérifier le stock actuel du produit
    SELECT stock INTO v_stock
    FROM Produits
    WHERE id = p_produit_id;

    -- Si le stock est insuffisant, retourner une erreur
    IF v_stock < p_quantite THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Stock insuffisant';
    ELSE
        -- Décrémenter le stock
        UPDATE Produits
        SET stock = stock - p_quantite
        WHERE id = p_produit_id;
    END IF;
END ;






CREATE PROCEDURE NotificationsStockFaible(
    IN p_seuil INT
)
BEGIN
    SELECT p.nom, p.stock
    FROM Produits p
    WHERE p.stock < p_seuil;
END ;



/* 
RechercheCommandes : Recherche des commandes par client, date, statut et produit.
StatistiquesVentes : Statistiques des ventes, produits les plus vendus et total des ventes sur une période.
GererStock : Gestion du stock, avec vérification et décrémentation automatique du stock.
NotificationsStockFaible : Récupère les produits dont le stock est inférieur à un seuil donné.
 */

/*
jeu de test 

CALL RechercheCommandes(1, '2021-01-01', '2021-12-31', 'En cours', 1);
CALL StatistiquesVentes('2021-01-01', '2021-12-31');
CALL GererStock(1, 5);
Call NotificationsStockFaible(100);
*/