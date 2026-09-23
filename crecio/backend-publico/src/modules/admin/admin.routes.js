const express = require('express')
const verifyToken = require('../../middleware/verifyToken')
const { getResumen, getInventario } = require('./admin.controller')

const router = express.Router()

// Todas las rutas de este módulo se resuelven a partir del usuario del JWT.
// El cliente nunca envía el id del negocio que desea administrar.
router.get('/resumen', verifyToken, getResumen)
router.get('/inventario', verifyToken, getInventario)

module.exports = router
