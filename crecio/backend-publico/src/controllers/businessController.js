const pool = require('../db/db');

// Lista todos los negocios activos; acepta ?search= para filtrar por nombre
const getAll = async (req, res) => {
  const { search } = req.query;

  try {
    let query = `
      SELECT n.pk_id, n.nombre, n.categoria, n.descripcion,
             n.direccion, n.distrito, n.whatsapp, n.logo_url,
             p.nombre AS plan_nombre
      FROM negocio n
      LEFT JOIN plan p ON n.fk_plan_id = p.pk_id
      WHERE n.activo = TRUE
    `;
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND n.nombre ILIKE $${params.length}`;
    }

    query += ' ORDER BY n.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener negocios', error: error.message });
  }
};

// Devuelve un negocio por su ID
const getById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT n.pk_id, n.nombre, n.categoria, n.descripcion,
              n.direccion, n.distrito, n.whatsapp, n.logo_url, n.verificado,
              p.nombre AS plan_nombre
       FROM negocio n
       LEFT JOIN plan p ON n.fk_plan_id = p.pk_id
       WHERE n.pk_id = $1 AND n.activo = TRUE`,
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Negocio no encontrado' });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener negocio', error: error.message });
  }
};

module.exports = { getAll, getById };
