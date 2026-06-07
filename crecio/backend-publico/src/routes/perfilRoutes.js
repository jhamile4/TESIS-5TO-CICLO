const express    = require('express')
const router     = express.Router()
const { getPerfil, getMisPedidos, actualizarPerfil, confirmarPagoEfectivo } = require('../controllers/perfilController')
const verifyToken = require('../middleware/verifyToken')

router.get('/me',                          verifyToken, getPerfil)
router.get('/pedidos',                     verifyToken, getMisPedidos)
router.put('/me',                          verifyToken, actualizarPerfil)
router.put('/pedidos/:pedidoId/confirmar', verifyToken, confirmarPagoEfectivo)

module.exports = router