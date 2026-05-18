const express = require('express')
const router = express.Router()
const { getByNegocio } = require('../controllers/productController')

router.get('/negocio/:id', getByNegocio)

module.exports = router