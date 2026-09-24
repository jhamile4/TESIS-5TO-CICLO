const express = require('express')
const verifyToken = require('../middleware/verifyToken')
const router  = express.Router()
const {
  register,
  login,
  registroCompleto,
  registroComprador,
  verificarComprador,
  reenviarCodigo,
  verificarEmail,
  getSession,
  logout,
} = require('../controllers/authController')

router.post('/register',             register)
router.post('/login',                login)
router.get('/session',               verifyToken, getSession)
router.post('/logout',               logout)
router.post('/registro',             registroCompleto)
router.post('/registro-comprador',   registroComprador)
router.post('/verificar-comprador',  verificarComprador)
router.post('/reenviar-codigo',      reenviarCodigo)
router.post('/verificar',            verificarEmail)

module.exports = router