const pool = require('../config/db');

// Registra un pedido cuando el cliente hace clic en "Pedir por WhatsApp"
const createOrder = async (req, res) => {
  const { fk_producto_id, fk_negocio_id } = req.body;
  const fk_cliente_id = req.user.pk_id;

  if (!fk_producto_id || !fk_negocio_id)
    return res.status(400).json({ message: 'Producto y negocio son requeridos' });

  try {
    const prod = await pool.query(
      'SELECT nombre, precio FROM producto WHERE pk_id = $1', [fk_producto_id]
    );

    const mensaje = prod.rows.length > 0
      ? `Hola, estoy interesado en "${prod.rows[0].nombre}" (S/ ${prod.rows[0].precio}). ¿Está disponible?`
      : 'Hola, estoy interesado en uno de sus productos.';

    const result = await pool.query(
      `INSERT INTO pedido_whatsapp (fk_cliente_id, fk_producto_id, fk_negocio_id, mensaje_generado)
       VALUES ($1, $2, $3, $4)
       RETURNING pk_id, fk_producto_id, fk_negocio_id, created_at`,
      [fk_cliente_id, fk_producto_id, fk_negocio_id, mensaje]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar pedido', error: error.message });
  }
};

// Devuelve el historial de pedidos del cliente autenticado
const getMyOrders = async (req, res) => {
  const fk_cliente_id = req.user.pk_id;

  try {
    const result = await pool.query(
      `SELECT pw.pk_id, pw.created_at,
              p.nombre AS producto, p.precio, p.imagen_url,
              n.nombre AS negocio, n.whatsapp
       FROM pedido_whatsapp pw
       JOIN producto p ON pw.fk_producto_id = p.pk_id
       JOIN negocio  n ON pw.fk_negocio_id  = n.pk_id
       WHERE pw.fk_cliente_id = $1
       ORDER BY pw.created_at DESC`,
      [fk_cliente_id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pedidos', error: error.message });
  }
};

module.exports = { createOrder, getMyOrders };
