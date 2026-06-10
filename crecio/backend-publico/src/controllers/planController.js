const planService = require('../services/planService')

const crearIntentPlan = async (req, res, next) => {
  try {
    const data = await planService.crearIntentPlan(req.body.planId, req.user.id, req.user.email)
    res.json(data)
  } catch (err) { next(err) }
}

const confirmarPlan = async (req, res, next) => {
  try {
    const { paymentIntentId, planId } = req.body
    const data = await planService.confirmarPlan(paymentIntentId, planId, req.user.id)
    res.json(data)
  } catch (err) { next(err) }
}

const getPlanActual = async (req, res, next) => {
  try {
    const data = await planService.getPlanActual(req.user.id)
    res.json(data)
  } catch (err) { next(err) }
}

module.exports = { crearIntentPlan, confirmarPlan, getPlanActual }
