const db = require('../db');

exports.placeOrder = (req, res) => {
    const { cart, address } = req.body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
        res.status(400).json({ message: 'Le panier est vide ou invalide' });
        return;
    }

    if (!address || !address.address || !address.city || !address.postalCode || !address.country) {
        res.status(400).json({ message: 'Adresse de livraison invalide' });
        return;
    }

    db.beginTransaction((err) => {
        if (err) {
            console.error('Error starting transaction:', err);
            res.status(500).json({ message: 'Erreur lors de la création de la transaction' });
            return;
        }

        let queries = cart.map(item => {
            return new Promise((resolve, reject) => {
                db.query('UPDATE products SET quantity = quantity - ? WHERE id = ? AND quantity >= ?', [item.quantity, item.id, item.quantity], (err, results) => {
                    if (err) {
                        console.error('Error updating product quantity:', err);
                        return reject(err);
                    }
                    if (results.affectedRows === 0) {
                        console.error(`Insufficient quantity for product ID ${item.id}`);
                        return reject(new Error(`Quantité insuffisante pour le produit avec l'ID ${item.id}`));
                    }
                    resolve();
                });
            });
        });

        Promise.all(queries)
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
