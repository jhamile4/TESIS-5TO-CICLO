const pool = require('../db/db')

const getPerfil = async (req, res) => {
  const { id } = req.user
  try {
    const result = await pool.query(
      `SELECT pk_id, nombre, email, created_at FROM cliente WHERE pk_id = $1`,
      [id]
    )
    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Usuario no encontrado' })
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener perfil', error: error.message })
  }
}

const getMisPedidos = async (req, res) => {
  const { id } = req.user
  try {
    const result = await pool.query(
      `SELECT
        pp.pk_id,
        pp.numero_pedido,
        pp.stripe_payment_intent,
        pp.monto_total,
        pp.estado,
        pp.items,
        pp.direccion,
        pp.ciudad,
        pp.notas,
        pp.created_at,
        n.nombre   AS negocio_nombre,
        n.logo_url AS negocio_logo,
        n.whatsapp AS negocio_whatsapp,
        n.pk_id    AS negocio_id
       FROM pedido_pago pp
       LEFT JOIN negocio n ON pp.fk_negocio_id = n.pk_id
       WHERE pp.fk_cliente_id = $1
       ORDER BY pp.created_at DESC`,
      [id]
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pedidos', error: error.message })
  }
}

const actualizarPerfil = async (req, res) => {
  const { id }     = req.user
  const { nombre } = req.body
  try {
    if (!nombre || nombre.trim().length < 2)
      return res.status(400).json({ message: 'El nombre debe tener al menos 2 caracteres' })
    const result = await pool.query(
      `UPDATE cliente SET nombre = $1 WHERE pk_id = $2 RETURNING pk_id, nombre, email`,
      [nombre.trim(), id]
    )
    res.json({ message: 'Perfil actualizado', cliente: result.rows[0] })
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar perfil', error: error.message })
  }
}

const confirmarPagoEfectivo = async (req, res) => {
  const { id }       = req.user
  const { pedidoId } = req.params
  try {
    const result = await pool.query(
      `UPDATE pedido_pago SET estado = 'pagado'
       WHERE pk_id = $1 AND fk_cliente_id = $2 AND estado = 'efectivo'
       RETURNING pk_id`,
      [pedidoId, id]
    )
    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Pedido no encontrado o ya confirmado' })
    res.json({ message: 'Pago confirmado', pk_id: result.rows[0].pk_id })
  } catch (error) {
    res.status(500).json({ message: 'Error al confirmar pago', error: error.message })
  }
}

module.exports = { getPerfil, getMisPedidos, actualizarPerfil, confirmarPagoEfectivo }