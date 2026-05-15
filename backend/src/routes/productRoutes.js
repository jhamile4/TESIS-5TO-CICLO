const express = require('express');
const router  = express.Router();
const { getByBusiness } = require('../controllers/productController');

// Ruta pública: devuelve los productos activos de un negocio dado su ID
router.get('/business/:businessId', getByBusiness);

module.exports = router;
