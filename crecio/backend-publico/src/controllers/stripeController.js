const stripeService = require('../services/stripeService')
const jwt           = require('jsonwebtoken')

const extraerClienteId = (authHeader) => {
  if (!authHeader) return null
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET)
    return decoded.id
  } catch { return null }
}

const crearPaymentIntent = async (req, res, next) => {
  try {
    const { items, fk_negocio_id, direccion, ciudad, notas, tipo_entrega } = req.body
    const clienteId = extraerClienteId(req.headers['authorization'])
    const data = await stripeService.crearPaymentIntent(items, fk_negocio_id, clienteId, direccion, ciudad, notas, tipo_entrega)
    res.json(data)
  } catch (err) { next(err) }
}

const confirmarPedidoEfectivo = async (req, res, next) => {
  try {
    const { items, fk_negocio_id, direccion, ciudad, notas, tipo_entrega } = req.body
    const clienteId = extraerClienteId(req.headers['authorization'])
    const data = await stripeService.confirmarPedidoEfectivo(items, fk_negocio_id, clienteId, direccion, ciudad, notas, tipo_entrega)
    res.json(data)
  } catch (err) { next(err) }
}

const confirmarPago = async (req, res, next) => {
  try {
    const data = await stripeService.confirmarPago(req.body.paymentIntentId)
    res.json(data)
  } catch (err) { next(err) }
}

module.exports = { crearPaymentIntent, confirmarPago, confirmarPedidoEfectivo }
