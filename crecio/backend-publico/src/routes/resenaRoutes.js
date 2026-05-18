const express = require('express')
const router = express.Router({ mergeParams: true })
const { getByNegocio } = require('../controllers/resenaController')

router.get('/', getByNegocio)

module.exports = router