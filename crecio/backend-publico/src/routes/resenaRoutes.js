const express = require('express');
const router  = express.Router({ mergeParams: true });
const { getByNegocio } = require('../controllers/resenaController');

// Ruta pública: reseñas de un negocio → GET /api/negocios/:id/resenas
router.get('/', getByNegocio);

module.exports = router;
