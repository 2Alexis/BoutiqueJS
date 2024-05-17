const db = require('../db'); // Import du module db pour la connexion à la base de données

exports.getSneakers = (req, res) => {
    
    // Exemple de requête pour obtenir toutes les sneakers
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des sneakers:', err);
            res.status(500).json({ message: 'Erreur lors de la récupération des sneakers' });
            return;
        }
        res.json(results); // Renvoie les résultats de la requête en tant que JSON
    });
}

exports.getSneaker = (req, res) => {
    const id = parseInt(req.params.id);
    // Exemple de requête pour obtenir une seule sneaker en fonction de son ID
    db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération de la sneaker:', err);
            res.status(500).json({ message: 'Erreur lors de la récupération de la sneaker' });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ message: 'Sneaker non trouvée' });
            return;
        }
        console.log(results); // Afficher les résultats dans la console
        res.json(results[0]); // Renvoie la première (et unique) sneaker trouvée en tant que JSON
    });
}