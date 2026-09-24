const express = require('express')
const verifyToken = require('../../middleware/verifyToken')
const { getResumen, getInventario, getTienda, updateTienda, createProduct, updateProduct, deleteProduct, getVentas, getClientes, getFinanzas, createExpense, generateMarketing } = require('./admin.controller')

const router = express.Router()

// Todas las rutas de este módulo se resuelven a partir del usuario del JWT.
// El cliente nunca envía el id del negocio que desea administrar.
router.get('/resumen', verifyToken, getResumen)
router.get('/inventario', verifyToken, getInventario)
router.get('/tienda', verifyToken, getTienda)
router.put('/tienda', verifyToken, updateTienda)
router.get('/ventas', verifyToken, getVentas)
router.get('/clientes', verifyToken, getClientes)
router.get('/finanzas', verifyToken, getFinanzas)
router.post('/gastos', verifyToken, createExpense)
router.post('/marketing/generar', verifyToken, generateMarketing)
router.post('/productos', verifyToken, createProduct)
router.put('/productos/:id', verifyToken, updateProduct)
router.delete('/productos/:id', verifyToken, deleteProduct)

module.exports = router

