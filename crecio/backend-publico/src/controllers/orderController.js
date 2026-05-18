const pool = require('../db/db')

const registrarPedidoPublico = async (req, res) => {
  const { fk_negocio_id, mensaje_generado } = req.body
  try {
    await pool.query(
      `INSERT INTO pedido_whatsapp (fk_negocio_id, mensaje_generado)
       VALUES ($1, $2)`,
      [fk_negocio_id, mensaje_generado]
    )
    res.json({ message: 'Pedido registrado correctamente' })
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar pedido', error: error.message })
  }
}

module.exports = { registrarPedidoPublico }