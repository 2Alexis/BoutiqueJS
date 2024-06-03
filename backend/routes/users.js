const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', userController.profile);

router.post('/:userId/favorites', userController.addFavorite);
router.delete('/:userId/favorites/:productId', userController.removeFavorite);
router.get('/:userId/favorites', userController.getFavorites);
router.post('/:userId/cart/checkout', userController.checkout);

module.exports = router;

module.exports = router;
