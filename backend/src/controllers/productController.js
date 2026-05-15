const pool = require('../config/db');

// Devuelve todos los productos activos de un negocio específico, ordenados del más reciente al más antiguo
const getByBusiness = async (req, res) => {
  const { businessId } = req.params;

  try {
    const result = await pool.query(
      `SELECT pk_id, nombre, descripcion, precio, imagen_url, stock, categoria
       FROM producto
       WHERE fk_negocio_id = $1 AND activo = TRUE
       ORDER BY created_at DESC`,
      [businessId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
};

module.exports = { getByBusiness };
