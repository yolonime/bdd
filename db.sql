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
