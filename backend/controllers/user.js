// Import the necessary modules and initialize your environment
require('dotenv').config();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

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
            res.status(200).json({ message: 'Connexion réussie', token, userId: user.id });
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

exports.addFavorite = (req, res) => {
    const userId = req.params.userId;
    const { productId } = req.body;

    const query = 'INSERT INTO favorites (user_id, product_id) VALUES (?, ?)';
    db.query(query, [userId, productId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de l\'ajout aux favoris' });
        }

        res.status(201).json({ message: 'Produit ajouté aux favoris avec succès' });
    });
};

// Supprimer un favori
exports.removeFavorite = (req, res) => {
    const userId = req.params.userId;
    const productId = req.params.productId;

    const query = 'DELETE FROM favorites WHERE user_id = ? AND product_id = ?';
    db.query(query, [userId, productId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la suppression du favori' });
        }

        res.status(200).json({ message: 'Produit retiré des favoris avec succès' });
    });
};

// Récupérer les favoris d'un utilisateur
exports.getFavorites = (req, res) => {
    const userId = req.params.userId;

    const query = `
        SELECT p.* FROM products p
        JOIN favorites f ON p.id = f.product_id
        WHERE f.user_id = ?
    `;
    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la récupération des favoris' });
        }

        res.status(200).json(results);
    });
};

exports.checkout = async (req, res) => {
    const userId = req.params.userId;
    const { cart, address } = req.body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
        return res.status(400).json({ message: 'Le panier est vide ou invalide' });
    }

    if (!address || !address.address || !address.city || !address.postalCode || !address.country) {
        return res.status(400).json({ message: 'Adresse de livraison invalide' });
    }

    // Start a database transaction
    db.beginTransaction(async (err) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la transaction' });
        }

        try {
            // Check product quantities
            let checkQueries = cart.map(item => {
                return new Promise((resolve, reject) => {
                    db.query('SELECT quantity FROM products WHERE id = ?', [item.id], (err, results) => {
                        if (err) {
                            return reject(err);
                        }
                        if (results.length === 0 || results[0].quantity < item.quantity) {
                            return reject(new Error(`Quantité insuffisante de l'article ${item.name}`));
                        }
                        resolve();
                    });
                });
            });

            await Promise.all(checkQueries);

            // Proceed with Stripe session creation
            const line_items = cart.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: item.price * 100,
                },
                quantity: item.quantity,
            }));

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items,
                mode: 'payment',
                success_url: 'http://127.0.0.1:5500/frontend/success.html',
                cancel_url: 'http://127.0.0.1:5500/frontend/cancel.html',
            });

            // Update product quantities in the database
            let updateQueries = cart.map(item => {
                return new Promise((resolve, reject) => {
                    db.query('UPDATE products SET quantity = quantity - ? WHERE id = ?', [item.quantity, item.id], (err, results) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve();
                    });
                });
            });

            await Promise.all(updateQueries);

            // Commit the transaction
            db.commit((err) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json({ message: 'Erreur lors de la confirmation de la commande', error: err.message });
                    });
                }

                res.status(200).json({ id: session.id });
            });
        } catch (error) {
            // Rollback the transaction in case of error
            db.rollback(() => {
                res.status(500).json({ message: 'Erreur lors de la confirmation de la commande', error: error.message });
            });
        }
    });
};

exports.validateToken = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token manquant' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token invalide' });
        }
        res.status(200).json({ message: 'Token valide' });
    });
};
