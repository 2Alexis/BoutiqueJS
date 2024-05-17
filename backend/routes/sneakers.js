const express = require('express');
const router = express.Router();
const controllers = require("../controllers/sneaker");

router.get('/', controllers.getSneakers );
router.get('/:id', controllers.getSneaker );

module.exports = router;
