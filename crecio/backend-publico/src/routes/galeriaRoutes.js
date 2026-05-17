const express = require('express');
const router  = express.Router({ mergeParams: true });
const { getByNegocio } = require('../controllers/galeriaController');

// Ruta pública: galería de imágenes de un negocio → GET /api/negocios/:id/galeria
router.get('/', getByNegocio);

module.exports = router;
