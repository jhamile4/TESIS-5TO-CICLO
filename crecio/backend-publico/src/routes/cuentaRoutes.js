const express     = require('express')
const router      = express.Router()
const verifyToken = require('../middleware/verifyToken')
const {
  getFavoritos, toggleFavorito,
  getVistos, registrarVisto,
  getOfertas, getParaTi, getParaTiEconomico,
  getCarrito, agregarAlCarrito, actualizarCarrito, limpiarCarrito,
  buscar,
} = require('../controllers/cuentaController')

router.get('/favoritos',         verifyToken, getFavoritos)
router.post('/favoritos/toggle', verifyToken, toggleFavorito)
router.get('/vistos',            verifyToken, getVistos)
router.post('/vistos',           verifyToken, registrarVisto)
router.get('/ofertas',                        getOfertas)
router.get('/para-ti',           verifyToken, getParaTi)
router.get('/para-ti/economico', verifyToken, getParaTiEconomico)
router.get('/carrito',           verifyToken, getCarrito)
router.post('/carrito',          verifyToken, agregarAlCarrito)
router.put('/carrito',           verifyToken, actualizarCarrito)
router.delete('/carrito',        verifyToken, limpiarCarrito)
router.get('/buscar',                         buscar)

module.exports = router