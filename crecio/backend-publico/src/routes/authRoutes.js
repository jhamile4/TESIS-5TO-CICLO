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
  solicitarRecuperacion,
  restablecerPassword,
  cambiarPassword,
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
router.post('/recuperar',            solicitarRecuperacion)
router.post('/restablecer',          restablecerPassword)
router.put('/contrasena',            verifyToken, cambiarPassword)

module.exports = router