const express     = require('express')
const router      = express.Router()
const verifyToken = require('../middleware/verifyToken')
const { crearIntentPlan, confirmarPlan, getPlanActual } = require('../controllers/planController')

router.post('/crear-intent', verifyToken, crearIntentPlan)
router.post('/confirmar',    verifyToken, confirmarPlan)
router.get('/actual',        verifyToken, getPlanActual)

module.exports = router
