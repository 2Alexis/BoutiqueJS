const db = require('../db');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.placeOrder = (req, res) => {
    const { cart, address } = req.body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
        return res.status(400).json({ message: 'Le panier est vide ou invalide' });
    }

    if (!address || !address.address || !address.city || !address.postalCode || !address.country) {
        return res.status(400).json({ message: 'Adresse de livraison invalide' });
    }

    db.beginTransaction((err) => {
        if (err) {
            console.error('Error starting transaction:', err);
            return res.status(500).json({ message: 'Erreur lors de la création de la transaction' });
        }

        let checkQueries = cart.map(item => {
            return new Promise((resolve, reject) => {
                db.query('SELECT quantity FROM products WHERE id = ?', [item.id], (err, results) => {
                    if (err) {
                        console.error('Error fetching product quantity:', err);
                        return reject(err);
                    }
                    if (results.length === 0 || results[0].quantity < item.quantity) {
                        return reject(new Error(`Quantité insuffisante pour le produit avec l'ID ${item.id}`));
                    }
                    resolve();
                });
            });
        });

        Promise.all(checkQueries)
            .then(() => {
                let updateQueries = cart.map(item => {
                    return new Promise((resolve, reject) => {
                        db.query('UPDATE products SET quantity = quantity - ? WHERE id = ?', [item.quantity, item.id], (err, results) => {
                            if (err) {
                                console.error('Error updating product quantity:', err);
                                return reject(err);
                            }
                            resolve();
                        });
                    });
                });

                return Promise.all(updateQueries);
            })
            .then(() => {
                const orderQuery = 'INSERT INTO orders (address, city, postalCode, country) VALUES (?, ?, ?, ?)';
                db.query(orderQuery, [address.address, address.city, address.postalCode, address.country], (err, results) => {
                    if (err) {
                        console.error('Error inserting order:', err);
                        return db.rollback(() => {
                            res.status(500).json({ message: 'Erreur lors de l\'enregistrement de la commande' });
                        });
                    }
                    db.commit(err => {
                        if (err) {
                            console.error('Error committing transaction:', err);
                            return db.rollback(() => {
                                res.status(500).json({ message: 'Erreur lors de la finalisation de la transaction' });
                            });
                        }
                        res.status(200).json({ message: 'Commande passée avec succès' });
                    });
                });
            })
            .catch((err) => {
                console.error('Error processing order:', err);
                db.rollback(() => {
                    res.status(500).json({ message: err.message || 'Erreur lors du traitement de la commande' });
                });
            });
    });
};