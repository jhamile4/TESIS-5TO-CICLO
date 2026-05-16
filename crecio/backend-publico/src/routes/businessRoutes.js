const express = require('express');
const router  = express.Router();
const { getAll, getById } = require('../controllers/businessController');

// Ruta pública: lista todos los negocios (acepta ?search=nombre)
router.get('/', getAll);

// Ruta pública: devuelve un negocio por su ID
router.get('/:id', getById);

module.exports = router;
