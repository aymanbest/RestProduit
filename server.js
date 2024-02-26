const express = require('express');
const productRoutes = require('./productRoutes'); // Importer le routeur d'authentification
const { MongoClient } = require('mongodb');

const app = express();
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'ProductsDB';
let db;

// Middleware pour le parsing du corps de la requête
app.use(express.json());

app.use('/produit', productRoutes);
// Middleware pour la connexion à la base de données MongoDB
MongoClient.connect(url)
    .then((client) => {
        app.locals.db = client.db(dbName);
        console.log('Successfully connected to the database.');

        // Démarrage du serveur une fois la connexion à la base de données établie
        const port = 3000;
        app.listen(port, () => {
            console.log(`Le serveur écoute sur le port ${port}`);
        });
    })
    .catch((err) => {
        console.log('Failed to connect to the database.', err);
    });

