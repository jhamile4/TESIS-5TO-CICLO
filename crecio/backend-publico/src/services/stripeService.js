const Stripe     = require('stripe')
const pedidoModel = require('../models/pedidoModel')
const { ENVIO_GRATIS_DESDE, COSTO_ENVIO } = require('../config/constants')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const crearPaymentIntent = async (items, negocioId, clienteId, direccion, ciudad, notas) => {
  if (!items || items.length === 0)
    throw { status: 400, message: 'El carrito está vacío' }

  const subtotal      = items.reduce((s, i) => s + i.precio * i.cantidad, 0)
  const envio         = subtotal >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO
  const total         = subtotal + envio
  const totalCentavos = Math.round(total * 100)

  const paymentIntent = await stripe.paymentIntents.create({
    amount:   totalCentavos,
    currency: 'pen',
    metadata: {
      fk_negocio_id: String(negocioId),
      fk_cliente_id: String(clienteId || ''),
      items: JSON.stringify(items.map(i => ({ nombre: i.nombre, cantidad: i.cantidad, precio: i.precio }))),
    },
  })

  const result = await pedidoModel.createPago(
    negocioId, clienteId, paymentIntent.id, total, items, direccion, ciudad, notas
  )

  return { clientSecret: paymentIntent.client_secret, ordenId: result.rows[0].pk_id }
}

const confirmarPedidoEfectivo = async (items, negocioId, clienteId, direccion, ciudad, notas, montoTotal) => {
  if (!items || items.length === 0)
    throw { status: 400, message: 'El carrito está vacío' }
  if (!direccion)
    throw { status: 400, message: 'La dirección es obligatoria' }

  const result = await pedidoModel.createEfectivo(
    negocioId, clienteId, montoTotal, items, direccion, ciudad, notas
  )
  return { message: 'Pedido confirmado', ordenId: result.rows[0].pk_id }
}

const confirmarPago = async (paymentIntentId) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

  if (paymentIntent.status === 'succeeded') {
    await pedidoModel.updateEstado(paymentIntentId, 'pagado')
    return { message: 'Pago confirmado', estado: 'pagado' }
  }

  throw { status: 400, message: 'El pago no fue completado', estado: paymentIntent.status }
}

module.exports = { crearPaymentIntent, confirmarPedidoEfectivo, confirmarPago }
