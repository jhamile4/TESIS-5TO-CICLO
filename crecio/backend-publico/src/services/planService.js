const Stripe      = require('stripe')
const negocioModel = require('../models/negocioModel')
const { PLANES }  = require('../config/constants')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const crearIntentPlan = async (planId, clienteId, clienteEmail) => {
  const plan = PLANES[planId]
  if (!plan) throw { status: 400, message: 'Plan no válido' }

  const paymentIntent = await stripe.paymentIntents.create({
    amount:   plan.monto,
    currency: 'pen',
    metadata: {
      tipo:         'plan',
      planId,
      clienteId:    String(clienteId),
      clienteEmail,
    },
  })

  return { clientSecret: paymentIntent.client_secret, plan: { ...plan, id: planId } }
}

const confirmarPlan = async (paymentIntentId, planId, clienteId) => {
  const plan = PLANES[planId]
  if (!plan) throw { status: 400, message: 'Plan no válido' }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
  if (paymentIntent.status !== 'succeeded')
    throw { status: 400, message: 'El pago no fue completado' }

  // El pago debe ser de este plan, de este usuario y por el monto correcto
  const { metadata } = paymentIntent
  const pagoValido =
    metadata.tipo === 'plan' &&
    metadata.planId === planId &&
    metadata.clienteId === String(clienteId) &&
    paymentIntent.amount === plan.monto &&
    paymentIntent.currency === 'pen'
  if (!pagoValido)
    throw { status: 400, message: 'El pago no corresponde a este plan' }

  // Un mismo pago no puede activar (ni renovar) el plan dos veces
  if (metadata.aplicado === 'true')
    throw { status: 409, message: 'Este pago ya fue usado para activar un plan' }

  const expira   = new Date()
  expira.setMonth(expira.getMonth() + plan.meses)
  const planBase = planId.replace('_anual', '')

  await negocioModel.updatePlan(clienteId, planBase, expira)
  await stripe.paymentIntents.update(paymentIntentId, { metadata: { aplicado: 'true' } })

  return { message: 'Plan activado exitosamente', plan: planBase, plan_expira: expira }
}

const getPlanActual = async (clienteId) => {
  const result = await negocioModel.getPlan(clienteId)
  if (result.rows.length === 0) return { plan: 'gratis', plan_expira: null }
  return result.rows[0]
}

module.exports = { crearIntentPlan, confirmarPlan, getPlanActual }
