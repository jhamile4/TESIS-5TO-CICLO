const express = require('express')
const router  = express.Router()
const { crearPaymentIntent, confirmarPago } = require('../controllers/stripeController')

router.post('/crear-intent', crearPaymentIntent)
router.post('/confirmar',    confirmarPago)

module.exports = router