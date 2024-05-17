const express = require('express');
const cors = require('cors');
const sneakersRoutes = require('./routes/sneakers');

const app = express();
const port = 5500;

// Utilisation de CORS middleware
app.use(cors());

// Utilisation du middleware pour parser le JSON
app.use(express.json());

// Utilisation des routes
app.use('/sneakers', sneakersRoutes);

// Démarrage du serveur
app.listen(port, () => console.log(`Listening on port ${port}`));
