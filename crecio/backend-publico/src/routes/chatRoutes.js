const express = require('express')
const router  = express.Router()
const { chatNegocio, chatCrecio } = require('../controllers/chatController')

router.post('/negocio', chatNegocio)
router.post('/crecio',  chatCrecio)

module.exports = router