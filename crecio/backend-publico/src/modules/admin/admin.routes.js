const express = require('express')
const verifyToken = require('../../middleware/verifyToken')
const {
  getResumen,
  getInventario,
  getTienda,
  updateTienda,
  createProduct,
  updateProduct,
  deleteProduct,
  getVentas,
  createSale,
  getClientes,
  getFinanzas,
  createExpense,
  generateMarketing,
  generateProductImage,
  getMarketingPosts,
  saveMarketingPost,
  publishDirectlyMarketing,
  getSocialAccounts,
  connectSocialAccount,
} = require('./admin.controller')

const router = express.Router()

router.get('/resumen', verifyToken, getResumen)
router.get('/inventario', verifyToken, getInventario)
router.get('/tienda', verifyToken, getTienda)
router.put('/tienda', verifyToken, updateTienda)
router.get('/ventas', verifyToken, getVentas)
router.post('/ventas', verifyToken, createSale)
router.get('/clientes', verifyToken, getClientes)
router.get('/finanzas', verifyToken, getFinanzas)
router.post('/gastos', verifyToken, createExpense)
router.post('/marketing/generar', verifyToken, generateMarketing)
router.get('/marketing/publicaciones', verifyToken, getMarketingPosts)
router.post('/marketing/publicaciones', verifyToken, saveMarketingPost)
router.post('/marketing/publicar-directo', verifyToken, publishDirectlyMarketing)
router.get('/marketing/redes', verifyToken, getSocialAccounts)
router.post('/marketing/redes', verifyToken, connectSocialAccount)
router.post('/productos/generar-imagen', verifyToken, generateProductImage)
router.post('/productos', verifyToken, createProduct)
router.put('/productos/:id', verifyToken, updateProduct)
router.delete('/productos/:id', verifyToken, deleteProduct)

module.exports = router


