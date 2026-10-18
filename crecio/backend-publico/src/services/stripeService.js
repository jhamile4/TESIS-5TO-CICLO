const Stripe        = require('stripe')
const pool          = require('../config/db')
const pedidoModel   = require('../models/pedidoModel')
const productoModel = require('../models/productoModel')
const { ENVIO_GRATIS_DESDE, COSTO_ENVIO } = require('../config/constants')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Arma el pedido con precios y stock de la BD; del carrito solo se usa id y cantidad
const prepararPedido = async (items, negocioId, tipoEntrega) => {
  if (!Array.isArray(items) || items.length === 0)
    throw { status: 400, message: 'El carrito está vacío' }

  const cantidades = new Map()
  for (const item of items) {
    const id       = Number(item.pk_id ?? item.id)
    const cantidad = Number(item.cantidad)
    if (!Number.isInteger(id) || !Number.isInteger(cantidad) || cantidad <= 0)
      throw { status: 400, message: 'Producto o cantidad no válida en el carrito' }
    cantidades.set(id, (cantidades.get(id) || 0) + cantidad)
  }

  const result = await productoModel.findByIds(negocioId, [...cantidades.keys()])
  if (result.rows.length !== cantidades.size)
    throw { status: 400, message: 'Algún producto ya no está disponible en esta tienda' }

  const itemsPedido = result.rows.map((producto) => {
    const cantidad = cantidades.get(producto.pk_id)
    if (producto.stock < cantidad)
      throw { status: 409, message: `Stock insuficiente para "${producto.nombre}" (quedan ${producto.stock})` }
    return { pk_id: producto.pk_id, nombre: producto.nombre, precio: Number(producto.precio), cantidad, img: producto.imagen_url || null }
  })

  const subtotal = itemsPedido.reduce((s, i) => s + i.precio * i.cantidad, 0)
  // Si recoge en tienda no hay envío; el delivery lo hace el propio negocio
  const envio    = tipoEntrega === 'recojo' || subtotal >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO
  const total    = Math.round((subtotal + envio) * 100) / 100

  return { itemsPedido, total }
}

const TIPOS_ENTREGA = ['delivery', 'recojo']

const validarEntrega = (tipoEntrega, direccion) => {
  const tipo = tipoEntrega || 'delivery'
  if (!TIPOS_ENTREGA.includes(tipo))
    throw { status: 400, message: 'Tipo de entrega no válido' }
  if (tipo === 'delivery' && !direccion?.trim())
    throw { status: 400, message: 'La dirección es obligatoria para delivery' }
  return tipo
}

const crearPaymentIntent = async (items, negocioId, clienteId, direccion, ciudad, notas, tipoEntrega) => {
  const tipo = validarEntrega(tipoEntrega, direccion)
  const { itemsPedido, total } = await prepararPedido(items, negocioId, tipo)

  const paymentIntent = await stripe.paymentIntents.create({
    amount:   Math.round(total * 100),
    currency: 'pen',
    metadata: {
      fk_negocio_id: String(negocioId),
      fk_cliente_id: String(clienteId || ''),
      items: JSON.stringify(itemsPedido.map(i => ({ nombre: i.nombre, cantidad: i.cantidad, precio: i.precio }))),
    },
  })

  const result = await pedidoModel.createPago(
    negocioId, clienteId, paymentIntent.id, total, itemsPedido, direccion, ciudad, notas, tipo
  )

  return { clientSecret: paymentIntent.client_secret, ordenId: result.rows[0].pk_id, total }
}

const confirmarPedidoEfectivo = async (items, negocioId, clienteId, direccion, ciudad, notas, tipoEntrega) => {
  const tipo = validarEntrega(tipoEntrega, direccion)
  const { itemsPedido, total } = await prepararPedido(items, negocioId, tipo)

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    for (const item of itemsPedido) {
      const descuento = await productoModel.descontarStock(client, negocioId, item.pk_id, item.cantidad)
      if (descuento.rowCount === 0)
        throw { status: 409, message: `Stock insuficiente para "${item.nombre}"` }
    }

    const result = await pedidoModel.createEfectivo(
      negocioId, clienteId, total, itemsPedido, direccion, ciudad, notas, tipo, client
    )

    await client.query('COMMIT')
    return { message: 'Pedido confirmado', ordenId: result.rows[0].pk_id, total }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const confirmarPago = async (paymentIntentId) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

  if (paymentIntent.status !== 'succeeded')
    throw { status: 400, message: 'El pago no fue completado', estado: paymentIntent.status }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Solo la primera confirmación descuenta stock; las repetidas no hacen nada
    const pedido = await pedidoModel.marcarPagado(client, paymentIntentId)
    if (pedido.rows.length > 0) {
      const { fk_negocio_id, items } = pedido.rows[0]
      for (const item of items || []) {
        if (item.pk_id) await productoModel.descontarStockForzado(client, fk_negocio_id, item.pk_id, item.cantidad)
      }
    }

    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }

  return { message: 'Pago confirmado', estado: 'pagado' }
}

module.exports = { crearPaymentIntent, confirmarPedidoEfectivo, confirmarPago }
