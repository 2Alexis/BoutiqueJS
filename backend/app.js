require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sneakersRoutes = require('./routes/sneakers');
const ordersRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');

const app = express();
const port = 5500;

// Utilisation de CORS middleware
app.use(cors());

// Utilisation du middleware pour parser le JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Utilisation des routes
app.use('/sneakers', sneakersRoutes);
app.use('/orders', ordersRoutes);
app.use('/users', userRoutes);

// Démarrage du serveur
app.listen(port, () => console.log(`Listening on port ${port}`));
