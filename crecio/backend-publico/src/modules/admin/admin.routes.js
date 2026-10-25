const express = require('express')
const verifyToken = require('../../middleware/verifyToken')
const {
  getResumen,
  getInventario,
  getPlan,
  getTienda,
  updateTienda,
  createProduct,
  updateProduct,
  deleteProduct,
  getVentas,
  createSale,
  updateOrderStatus,
  getNotificaciones,
  marcarNotificacionesLeidas,
  getGaleria,
  agregarFotoGaleria,
  quitarFotoGaleria,
  getClientes,
  getFinanzas,
  createExpense,
  setSalesGoal,
  generateMarketing,
  generateProductImage,
  getMarketingPosts,
  saveMarketingPost,
  publishDirectlyMarketing,
  getSocialAccounts,
  connectSocialAccount,
  disconnectSocialAccount,
  deleteMarketingPost,
  getMetaAuthUrl,
  handleMetaOAuthCallback,
} = require('./admin.controller')

const router = express.Router()

router.get('/resumen', verifyToken, getResumen)
router.get('/inventario', verifyToken, getInventario)
router.get('/plan', verifyToken, getPlan)
router.get('/tienda', verifyToken, getTienda)
router.put('/tienda', verifyToken, updateTienda)
router.get('/galeria', verifyToken, getGaleria)
router.post('/galeria', verifyToken, agregarFotoGaleria)
router.delete('/galeria/:id', verifyToken, quitarFotoGaleria)
router.get('/ventas', verifyToken, getVentas)
router.post('/ventas', verifyToken, createSale)
router.put('/ventas/:id/estado', verifyToken, updateOrderStatus)
router.get('/notificaciones', verifyToken, getNotificaciones)
router.post('/notificaciones/leidas', verifyToken, marcarNotificacionesLeidas)
router.get('/clientes', verifyToken, getClientes)
router.get('/finanzas', verifyToken, getFinanzas)
router.post('/gastos', verifyToken, createExpense)
router.put('/finanzas/meta', verifyToken, setSalesGoal)
router.post('/marketing/generar', verifyToken, generateMarketing)
router.get('/marketing/publicaciones', verifyToken, getMarketingPosts)
router.post('/marketing/publicaciones', verifyToken, saveMarketingPost)
router.delete('/marketing/publicaciones/:id', verifyToken, deleteMarketingPost)
router.post('/marketing/publicar-directo', verifyToken, publishDirectlyMarketing)
router.get('/marketing/redes', verifyToken, getSocialAccounts)
router.post('/marketing/redes', verifyToken, connectSocialAccount)
router.delete('/marketing/redes/:id', verifyToken, disconnectSocialAccount)
router.get('/marketing/meta/auth-url', verifyToken, getMetaAuthUrl)
router.post('/marketing/meta/callback', verifyToken, handleMetaOAuthCallback)
router.post('/productos/generar-imagen', verifyToken, generateProductImage)
router.post('/productos', verifyToken, createProduct)
router.put('/productos/:id', verifyToken, updateProduct)
router.delete('/productos/:id', verifyToken, deleteProduct)

module.exports = router


