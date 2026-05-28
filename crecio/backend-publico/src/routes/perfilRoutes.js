const express    = require('express')
const router     = express.Router()
const { getPerfil, getMisPedidos, actualizarPerfil } = require('../controllers/perfilController')
const verifyToken = require('../middleware/verifyToken')

router.get('/me',       verifyToken, getPerfil)
router.get('/pedidos',  verifyToken, getMisPedidos)
router.put('/me',       verifyToken, actualizarPerfil)

module.exports = router