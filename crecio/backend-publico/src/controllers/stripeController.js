const Stripe = require('stripe')
const pool   = require('../db/db')
const jwt    = require('jsonwebtoken')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const crearPaymentIntent = async (req, res) => {
  const { items, fk_negocio_id, direccion, ciudad, notas } = req.body

  if (!items || items.length === 0)
    return res.status(400).json({ message: 'El carrito está vacío' })

  let fk_cliente_id = null
  const authHeader = req.headers['authorization']
  if (authHeader) {
    try {
      const token   = authHeader.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      fk_cliente_id = decoded.id
    } catch {}
  }

  try {
    const envio         = items.reduce((s, i) => s + i.precio * i.cantidad, 0) >= 200 ? 0 : 15
    const subtotal      = items.reduce((s, i) => s + i.precio * i.cantidad, 0)
    const total         = subtotal + envio
    const totalCentavos = Math.round(total * 100)

    const paymentIntent = await stripe.paymentIntents.create({
      amount:   totalCentavos,
      currency: 'pen',
      metadata: {
        fk_negocio_id: String(fk_negocio_id),
        fk_cliente_id: String(fk_cliente_id || ''),
        items: JSON.stringify(items.map(i => ({ nombre: i.nombre, cantidad: i.cantidad, precio: i.precio }))),
      },
    })

    const result = await pool.query(
      `INSERT INTO pedido_pago (fk_negocio_id, fk_cliente_id, stripe_payment_intent, monto_total, estado, items, direccion, ciudad, notas)
       VALUES ($1, $2, $3, $4, 'pendiente', $5, $6, $7, $8) RETURNING pk_id`,
      [fk_negocio_id, fk_cliente_id, paymentIntent.id, total, JSON.stringify(items), direccion || null, ciudad || null, notas || null]
    )

    res.json({ clientSecret: paymentIntent.client_secret, ordenId: result.rows[0].pk_id })
  } catch (error) {
    console.error('Error Stripe:', error.message)
    res.status(500).json({ message: 'Error al procesar pago', error: error.message })
  }
}

const confirmarPedidoEfectivo = async (req, res) => {
  const { items, fk_negocio_id, direccion, ciudad, notas, monto_total } = req.body

  if (!items || items.length === 0)
    return res.status(400).json({ message: 'El carrito está vacío' })
  if (!direccion)
    return res.status(400).json({ message: 'La dirección es obligatoria' })

  let fk_cliente_id = null
  const authHeader = req.headers['authorization']
  if (authHeader) {
    try {
      const token   = authHeader.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      fk_cliente_id = decoded.id
    } catch {}
  }

  try {
    const result = await pool.query(
      `INSERT INTO pedido_pago (fk_negocio_id, fk_cliente_id, stripe_payment_intent, monto_total, estado, items, direccion, ciudad, notas)
       VALUES ($1, $2, NULL, $3, 'efectivo', $4, $5, $6, $7) RETURNING pk_id`,
      [fk_negocio_id, fk_cliente_id, monto_total, JSON.stringify(items), direccion, ciudad || null, notas || null]
    )
    res.json({ message: 'Pedido confirmado', ordenId: result.rows[0].pk_id })
  } catch (error) {
    res.status(500).json({ message: 'Error al confirmar pedido', error: error.message })
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

module.exports = { crearPaymentIntent, confirmarPago, confirmarPedidoEfectivo }