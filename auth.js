const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Auth = express.Router();

// Route for user authentication
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

// Route for user registration
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

// Exporting the Auth router and verifyToken middleware
module.exports = { Auth, verifyToken };
