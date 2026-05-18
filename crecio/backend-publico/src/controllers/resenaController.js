const pool = require('../db/db')

const getByNegocio = async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      `SELECT pk_id, nombre_autor, estrellas, texto, created_at
       FROM resena
       WHERE fk_negocio_id = $1
       ORDER BY created_at DESC`,
      [id]
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener resenas', error: error.message })
  }
}

module.exports = { getByNegocio }