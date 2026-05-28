const Stripe = require('stripe')
const pool   = require('../db/db')
const jwt    = require('jsonwebtoken')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const crearPaymentIntent = async (req, res) => {
  const { items, fk_negocio_id } = req.body

  if (!items || items.length === 0)
    return res.status(400).json({ message: 'El carrito está vacío' })

  // Extraer cliente del token si existe
  let fk_cliente_id = null
  const authHeader = req.headers['authorization']
  if (authHeader) {
    try {
      const token   = authHeader.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      fk_cliente_id = decoded.id
    } catch {
      // token inválido — continuar sin cliente
    }
  }

  try {
    const total         = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
    const totalCentavos = Math.round(total * 100)

    const paymentIntent = await stripe.paymentIntents.create({
      amount:   totalCentavos,
      currency: 'pen',
      metadata: {
        fk_negocio_id:  String(fk_negocio_id),
        fk_cliente_id:  String(fk_cliente_id || ''),
        items: JSON.stringify(items.map(i => ({ nombre: i.nombre, cantidad: i.cantidad, precio: i.precio }))),
      },
    })

    await pool.query(
      `INSERT INTO pedido_pago (fk_negocio_id, fk_cliente_id, stripe_payment_intent, monto_total, estado, items)
       VALUES ($1, $2, $3, $4, 'pendiente', $5)`,
      [fk_negocio_id, fk_cliente_id, paymentIntent.id, total, JSON.stringify(items)]
    )

    res.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('Error Stripe:', error.message)
    res.status(500).json({ message: 'Error al procesar pago', error: error.message })
  }
}

const confirmarPago = async (req, res) => {
  const { paymentIntentId } = req.body
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status === 'succeeded') {
      await pool.query(
        `UPDATE pedido_pago SET estado = 'pagado' WHERE stripe_payment_intent = $1`,
        [paymentIntentId]
      )
      res.json({ message: 'Pago confirmado', estado: 'pagado' })
    } else {
      res.status(400).json({ message: 'El pago no fue completado', estado: paymentIntent.status })
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al confirmar pago', error: error.message })
  }
}

module.exports = { crearPaymentIntent, confirmarPago }