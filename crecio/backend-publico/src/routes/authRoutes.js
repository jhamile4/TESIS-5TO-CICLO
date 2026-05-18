const express = require('express')
const router = express.Router()
const { register, login, registroCompleto, verificarEmail } = require('../controllers/authController')

router.post('/register', register)
router.post('/login', login)
router.post('/registro', registroCompleto)
router.post('/verificar', verificarEmail)

module.exports = router
