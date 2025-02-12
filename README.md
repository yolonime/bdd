# Audit de la V1 - Système de gestion de stock

## 1. Introduction
L'audit de la V1 du système de gestion de stock a pour objectif d'identifier les failles de sécurité et les incohérences dans l'implémentation actuelle. La version actuelle est un prototype (POC) sans mesures de protection particulières.

## 2. Problématiques identifiées
### 2.1. Risques de sécurité
#### a) Injection SQL
- Utilisation de requêtes SQL directes sans paramétrisation (évitable avec `?` et des requêtes préparées).
- Exemples de vulnérabilités :
  ```js
  const sql = `INSERT INTO Categories (nom) VALUES ('${nom}')`;
  ```
  Un attaquant pourrait injecter du SQL malveillant en envoyant `nom = "'); DROP TABLE Categories; --"`.

#### b) Manque de validation des entrées
- Absence de vérifications sur les champs `nom`, `prix`, `stock`, etc.
- Risque d'ajouter des données incohérentes (ex. stock négatif, prix null).

#### c) Manque de gestion des erreurs
- Pas de capture fine des erreurs SQL.
- Renvoyer une erreur brute de MySQL peut divulguer des informations sensibles.

### 2.2. Incohérences métier
#### a) Stock non contrôlé lors des commandes
- Possibilité de passer commande même si le produit n'est pas en stock.
- Aucune mise à jour automatique du stock après une commande.

#### b) Suppression sans contrainte
- Suppression d'un client ou d'une catégorie sans vérifier si des commandes ou produits y sont liés.

## 3. Conclusion
Cet audit met en évidence les principales failles de la V1, soulignant les risques de sécurité et les incohérences métier identifiées dans le système.

