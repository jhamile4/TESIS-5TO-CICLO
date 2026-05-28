const express = require('express')
const router  = express.Router()
const {
  register,
  login,
  registroCompleto,
  registroComprador,
  verificarComprador,
  reenviarCodigo,
  verificarEmail,
} = require('../controllers/authController')

router.post('/register',             register)
router.post('/login',                login)
router.post('/registro',             registroCompleto)
router.post('/registro-comprador',   registroComprador)
router.post('/verificar-comprador',  verificarComprador)
router.post('/reenviar-codigo',      reenviarCodigo)
router.post('/verificar',            verificarEmail)

module.exports = router