const Stripe = require('stripe')
const pool   = require('../db/db')
const jwt    = require('jsonwebtoken')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const PLANES = {
  pro: {
    nombre:  'CRECIO Pro',
    monto:   4900, // S/49.00 en centavos
    meses:   1,
  },
  pro_anual: {
    nombre:  'CRECIO Pro Anual',
    monto:   46800, // S/39 x 12 = S/468 en centavos
    meses:   12,
  },
  enterprise: {
    nombre:  'CRECIO Enterprise',
    monto:   12900,
    meses:   1,
  },
  enterprise_anual: {
    nombre:  'CRECIO Enterprise Anual',
    monto:   118800,
    meses:   12,
  },
}

// Crear Payment Intent para plan
const crearIntentPlan = async (req, res) => {
  const { planId } = req.body
  const plan = PLANES[planId]
  if (!plan) return res.status(400).json({ message: 'Plan no válido' })

  // Extraer cliente del token
  const authHeader = req.headers['authorization']
  if (!authHeader) return res.status(401).json({ message: 'Token requerido' })

  let clienteId, clienteEmail
  try {
    const token   = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    clienteId     = decoded.id
    clienteEmail  = decoded.email
  } catch {
    return res.status(401).json({ message: 'Token inválido' })
  }

  try {
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

    res.json({
      clientSecret: paymentIntent.client_secret,
      plan:         { ...plan, id: planId },
    })
  } catch (error) {
    res.status(500).json({ message: 'Error al crear pago', error: error.message })
  }
}

// Confirmar pago del plan y actualizar negocio
const confirmarPlan = async (req, res) => {
  const { paymentIntentId, planId } = req.body

  const plan = PLANES[planId]
  if (!plan) return res.status(400).json({ message: 'Plan no válido' })

  // Extraer cliente del token
  const authHeader = req.headers['authorization']
  let clienteId
  try {
    const token   = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    clienteId     = decoded.id
  } catch {
    return res.status(401).json({ message: 'Token inválido' })
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== 'succeeded')
      return res.status(400).json({ message: 'El pago no fue completado' })

    // Calcular fecha de expiración
    const expira = new Date()
    expira.setMonth(expira.getMonth() + plan.meses)

    // Actualizar plan del negocio del cliente
    const planBase = planId.replace('_anual', '') // 'pro' o 'enterprise'
    await pool.query(
      `UPDATE negocio SET plan = $1, plan_expira = $2 WHERE fk_cliente_id = $3`,
      [planBase, expira, clienteId]
    )

    res.json({
      message:     'Plan activado exitosamente',
      plan:        planBase,
      plan_expira: expira,
    })
  } catch (error) {
    res.status(500).json({ message: 'Error al confirmar plan', error: error.message })
  }
}

// Obtener plan actual del negocio
const getPlanActual = async (req, res) => {
  const authHeader = req.headers['authorization']
  let clienteId
  try {
    const token   = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    clienteId     = decoded.id
  } catch {
    return res.status(401).json({ message: 'Token inválido' })
  }

  try {
    const result = await pool.query(
      `SELECT plan, plan_expira FROM negocio WHERE fk_cliente_id = $1 LIMIT 1`,
      [clienteId]
    )
    if (result.rows.length === 0)
      return res.json({ plan: 'gratis', plan_expira: null })

    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener plan', error: error.message })
  }
}

module.exports = { crearIntentPlan, confirmarPlan, getPlanActual }