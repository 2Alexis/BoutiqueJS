const express = require('express');
const router = express.Router();
const controllers = require("../controllers/order");

router.post('/place-order', controllers.placeOrder);


module.exports = router;
