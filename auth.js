const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Auth = express.Router();

async function authenticateUser(username, password, db) {
    const utilisateursCollection = db.collection('users');
    const user = await utilisateursCollection.findOne({ username: username });

    if (!user) {
        return null; // Utilisateur non trouvé
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log(passwordMatch);
    if (passwordMatch) {
        return user; // Authentification réussie
    } else {
        return null; // Mot de passe incorrect
    }
}

function verifyToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, 'secretkey');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).send('Invalid token.');
    }
}

Auth.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('ok');
    const db = req.app.locals.db;
    try {
        if (!db) {
            console.error('Database connection not established');
            return res.status(500).send('Failed to login');
        }

        const user = await authenticateUser(username, password, db);

        if (user) {
            const accessToken = jwt.sign({ username: user.username }, 'secretkey');
            res.json({ accessToken: accessToken });
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        console.error('Error authenticating user', error);
        res.status(500).send('Failed to login');
    }
});

Auth.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const db = req.app.locals.db;

    try {
        if (!db) {
            console.error('Database connection not established');
            return res.status(500).send('Failed to register user');
        }
        const utilisateursCollection = db.collection('users');
        const existingUser = await utilisateursCollection.findOne({ username: username });

        if (existingUser) {
            return res.status(400).send('Username already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { username: username, password: hashedPassword };
        await utilisateursCollection.insertOne(newUser);

        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error('Error registering user', error);
        res.status(500).send('Failed to register user');
    }
});

module.exports = {Auth, verifyToken};
