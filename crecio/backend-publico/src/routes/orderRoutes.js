const express = require('express')
const router = express.Router()
const { registrarPedidoPublico } = require('../controllers/orderController')

router.post('/publico', registrarPedidoPublico)

module.exports = router