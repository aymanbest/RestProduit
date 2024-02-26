
# API Rest avec Authentification

Cette API permet aux utilisateurs d'effectuer des opérations CRUD sur les produits.

## Tech Stack

**Test:** Postman

**Server:** Node, Express, MongoDb


## Installation
1- 
```
git clone https://github.com/aymanbest/RestProduit
```

2-
```
cd RestProduit
```

3-
```
npm i 
```

4- 
```
node server
```




## Structure de base de données
Collections: produits / users

### Produits :
name -> String

description -> String

price -> Float [>0]

stock -> Int [>0]

### Users: 
username -> String [unique]

password -> String
## Endpoints
### Authentification :

#### Login
```
POST /produit/login
```

#### Register
```
POST /produit/register
```

### Produits

#### Tous les produits
```
GET /produit
```

#### Produit par id
```
GET /produit/:id
```

#### Ajouter produit
```
POST /produit
```

#### Modifier produit
```
PUT /produit/:id
```

#### Supprimer produit
```
DELETE /produit/:id
```
