const express = require('express');
const router  = express.Router();
const { getAll, getById } = require('../controllers/businessController');

// Ruta pública: lista todos los negocios (acepta ?search= para filtrar)
router.get('/', getAll);

// Ruta pública: devuelve un negocio específico por su ID
router.get('/:id', getById);

module.exports = router;
