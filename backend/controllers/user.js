require('dotenv').config();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const secretKey = process.env.SECRET_KEY;

if (!secretKey) {
    throw new Error('SECRET_KEY must be defined in the .env file');
}

// Inscription d'un nouvel utilisateur
exports.register = (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Veuillez remplir tous les champs' });
    }

    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors du hachage du mot de passe' });
        }

        const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.query(query, [username, email, hashedPassword], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'utilisateur' });
            }

            res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
        });
    });
};

// Connexion de l'utilisateur
exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        console.log('Champs requis manquants');
        return res.status(400).json({ message: 'Veuillez remplir tous les champs' });
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.log('Erreur lors de la récupération de l\'utilisateur:', err);
            return res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur' });
        }

        if (results.length === 0) {
            console.log('Utilisateur non trouvé');
            return res.status(401).json({ message: 'Utilisateur non trouvé' });
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.log('Erreur lors de la comparaison des mots de passe:', err);
                return res.status(500).json({ message: 'Erreur lors de la comparaison des mots de passe' });
            }

            if (!isMatch) {
                console.log('Mot de passe incorrect');
                return res.status(401).json({ message: 'Mot de passe incorrect' });
            }

            const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });

            console.log('Connexion réussie');
            res.status(200).json({ message: 'Connexion réussie', token });
        });
    });
};

// Récupérer le profil de l'utilisateur
exports.profile = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Accès non autorisé' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token invalide' });
        }

        const query = 'SELECT id, username, email, created_at FROM users WHERE id = ?';
        db.query(query, [decoded.id], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur lors de la récupération du profil utilisateur' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            res.status(200).json({ user: results[0] });
        });
    });
};
