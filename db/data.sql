-- Insertion des catégories
INSERT INTO Categories (nom) VALUES
('Électronique'),
('Mobilier'),
('Alimentation'),
('Vêtements'),
('Sports'),
('Maquillage');

-- Insertion des fournisseurs
INSERT INTO Fournisseurs (nom, adresse, telephone) VALUES
('TechCorp', '123 Rue des Innovations, Paris', '0123456789'),
('Meubles&Co', '45 Avenue du Design, Lyon', '0987654321'),
('SuperMarché', '99 Boulevard de la Nourriture, Marseille', '0567894321'),
('FashionLine', '77 Rue de la Mode, Lille', '0789456123'),
('SportPro', '34 Avenue du Sport, Bordeaux', '0654321987');

-- Insertion des produits
INSERT INTO Produits (nom, description, prix, stock, categorie_id) VALUES
('Ordinateur Portable', 'Un ordinateur performant pour le travail et le jeu', 1200.50, 10, 1),
('Chaise de Bureau', 'Chaise ergonomique pour un confort maximal', 150.00, 25, 2),
('Pâtes', 'Pâtes italiennes de haute qualité', 2.50, 100, 3),
('T-shirt Coton', 'T-shirt confortable en coton bio', 20.00, 50, 4),
('Ballon de Football', 'Ballon de football taille officielle', 30.00, 30, 5),
('Rouge à lèvres', 'Rouge à lèvres longue tenue', 15.00, 20, 6);

-- Insertion des relations Produits-Fournisseurs
INSERT INTO Produits_Fournisseurs (produit_id, fournisseur_id) VALUES
(1, 1),
(1, 2),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

-- Insertion des clients
INSERT INTO Clients (nom, adresse, telephone) VALUES
('Jean Dupont', '12 Rue des Lilas, Paris', '0612345678'),
('Marie Curie', '87 Avenue de la Recherche, Lyon', '0623456789'),
('Albert Einstein', '99 Boulevard des Sciences, Strasbourg', '0634567890'),
('Isaac Newton', '56 Rue de la Gravité, Toulouse', '0645678901'),
('Galilée Galiléo', '101 Avenue des Étoiles, Nice', '0656789012');

-- Insertion des commandes
INSERT INTO Commandes (client_id, date_commande) VALUES
(1, NOW()),
(2, NOW()),
(3, NOW()),
(4, NOW()),
(5, NOW());

-- Insertion des lignes de commande
INSERT INTO Lignes_Commande (commande_id, produit_id, quantite, prix_unitaire) VALUES
(1, 1, 1, 1200.50),
(2, 3, 5, 2.50),
(3, 4, 2, 20.00),
(4, 5, 3, 30.00),
(5, 2, 1, 150.00);

