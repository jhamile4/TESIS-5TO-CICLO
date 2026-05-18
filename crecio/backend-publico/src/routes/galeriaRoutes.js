const express = require('express')
const router = express.Router({ mergeParams: true })
const { getByNegocio } = require('../controllers/galeriaController')

router.get('/', getByNegocio)

module.exports = router