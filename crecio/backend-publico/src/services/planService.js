const Stripe      = require('stripe')
const negocioModel = require('../models/negocioModel')
const { PLANES }  = require('../config/constants')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const crearIntentPlan = async (planId, clienteId, clienteEmail) => {
  const plan = PLANES[planId]
  if (!plan) throw { status: 400, message: 'Plan no válido' }
  // El plan es del negocio: sin negocio no se cobra (si no, se pagaría por nada)
  const negocio = await negocioModel.getPlan(clienteId)
  if (negocio.rows.length === 0)
    throw { status: 400, message: 'Primero crea tu tienda en CRECIO; el plan Pro se activa para tu negocio.' }

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

  // Si renueva antes de que venza, los meses nuevos se suman a los que le quedan
  const actual = (await negocioModel.getPlan(clienteId)).rows[0]
  if (!actual) throw { status: 400, message: 'Esta cuenta no tiene un negocio' }
  const venceEn = actual.plan === 'pro' && actual.plan_expira ? new Date(actual.plan_expira) : null
  const expira = venceEn && venceEn > new Date() ? venceEn : new Date()
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
