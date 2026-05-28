const express = require('express')
const router  = express.Router()
const { crearIntentPlan, confirmarPlan, getPlanActual } = require('../controllers/planController')

router.post('/crear-intent', crearIntentPlan)
router.post('/confirmar',    confirmarPlan)
router.get('/actual',        getPlanActual)

module.exports = router