const express = require('express')
const router  = express.Router()
const { crearPaymentIntent, confirmarPago, confirmarPedidoEfectivo } = require('../controllers/stripeController')

router.post('/crear-intent', crearPaymentIntent)
router.post('/confirmar',    confirmarPago)
router.post('/efectivo',     confirmarPedidoEfectivo)

module.exports = router