const pool = require('../config/db')

const createWhatsapp = (negocioId, mensaje) =>
  pool.query(
    `INSERT INTO pedido_whatsapp (fk_negocio_id, mensaje_generado) VALUES ($1, $2)`,
    [negocioId, mensaje]
  )

const createPago = (negocioId, clienteId, paymentIntentId, total, items, direccion, ciudad, notas) =>
  pool.query(
    `INSERT INTO pedido_pago
       (fk_negocio_id, fk_cliente_id, stripe_payment_intent, monto_total, estado, items, direccion, ciudad, notas)
     VALUES ($1, $2, $3, $4, 'pendiente', $5, $6, $7, $8) RETURNING pk_id`,
    [negocioId, clienteId, paymentIntentId, total, JSON.stringify(items), direccion || null, ciudad || null, notas || null]
  )

const createEfectivo = (negocioId, clienteId, montoTotal, items, direccion, ciudad, notas) =>
  pool.query(
    `INSERT INTO pedido_pago
       (fk_negocio_id, fk_cliente_id, stripe_payment_intent, monto_total, estado, items, direccion, ciudad, notas)
     VALUES ($1, $2, NULL, $3, 'efectivo', $4, $5, $6, $7) RETURNING pk_id`,
    [negocioId, clienteId, montoTotal, JSON.stringify(items), direccion, ciudad || null, notas || null]
  )

const updateEstado = (paymentIntentId, estado) =>
  pool.query(
    `UPDATE pedido_pago SET estado = $1 WHERE stripe_payment_intent = $2`,
    [estado, paymentIntentId]
  )

const confirmEfectivo = (pedidoId, clienteId) =>
  pool.query(
    `UPDATE pedido_pago SET estado = 'pagado'
     WHERE pk_id = $1 AND fk_cliente_id = $2 AND estado = 'efectivo'
     RETURNING pk_id`,
    [pedidoId, clienteId]
  )

const findByCliente = (clienteId) =>
  pool.query(
    `SELECT
       pp.pk_id, pp.numero_pedido, pp.stripe_payment_intent, pp.monto_total,
       pp.estado, pp.items, pp.direccion, pp.ciudad, pp.notas, pp.created_at,
       n.nombre   AS negocio_nombre,
       n.logo_url AS negocio_logo,
       n.whatsapp AS negocio_whatsapp,
       n.pk_id    AS negocio_id
     FROM pedido_pago pp
     LEFT JOIN negocio n ON pp.fk_negocio_id = n.pk_id
     WHERE pp.fk_cliente_id = $1
     ORDER BY pp.created_at DESC`,
    [clienteId]
  )

const findCategoriasCompradas = (clienteId) =>
  pool.query(
    `SELECT DISTINCT n.categoria FROM pedido_pago pp
     JOIN negocio n ON pp.fk_negocio_id = n.pk_id
     WHERE pp.fk_cliente_id = $1 AND pp.estado = 'pagado'`,
    [clienteId]
  )

module.exports = {
  createWhatsapp,
  createPago,
  createEfectivo,
  updateEstado,
  confirmEfectivo,
  findByCliente,
  findCategoriasCompradas,
}
