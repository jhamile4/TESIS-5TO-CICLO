const express = require('express');
const router  = express.Router();
const { getByBusiness } = require('../controllers/productController');

// Ruta pública: lista los productos de un negocio específico
router.get('/negocio/:businessId', getByBusiness);

module.exports = router;
