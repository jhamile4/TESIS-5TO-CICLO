const express = require('express')
const verifyToken = require('../../middleware/verifyToken')
const { getResumen, getInventario, createProduct, getVentas, getClientes, generateMarketing } = require('./admin.controller')

const router = express.Router()

// Todas las rutas de este módulo se resuelven a partir del usuario del JWT.
// El cliente nunca envía el id del negocio que desea administrar.
router.get('/resumen', verifyToken, getResumen)
router.get('/inventario', verifyToken, getInventario)
router.get('/ventas', verifyToken, getVentas)
router.get('/clientes', verifyToken, getClientes)
router.post('/marketing/generar', verifyToken, generateMarketing)
router.post('/productos', verifyToken, createProduct)

module.exports = router
