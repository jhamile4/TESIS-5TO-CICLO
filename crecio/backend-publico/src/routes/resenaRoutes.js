const express = require('express')
const router = express.Router({ mergeParams: true })
const verifyToken = require('../middleware/verifyToken')
const { getByNegocio, crear } = require('../controllers/resenaController')

router.get('/', getByNegocio)
router.post('/', verifyToken, crear)

module.exports = router
