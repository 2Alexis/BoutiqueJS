const db = require('../db'); // Import du module db pour la connexion à la base de données

exports.getSneakers = (req, res) => {
    db.query('SELECT *, quantity > 0 AS availability FROM products', (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des sneakers:', err);
            res.status(500).json({ message: 'Erreur lors de la récupération des sneakers' });
            return;
        }
        res.json(results);
    });
}

exports.getSneaker = (req, res) => {
    const id = parseInt(req.params.id);
    db.query('SELECT *, quantity > 0 AS availability FROM products WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération de la sneaker:', err);
            res.status(500).json({ message: 'Erreur lors de la récupération de la sneaker' });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ message: 'Sneaker non trouvée' });
            return;
        }
        res.json(results[0]);
    });
}