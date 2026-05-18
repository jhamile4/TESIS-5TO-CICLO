const pool = require('../db/db')

const getByNegocio = async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      `SELECT imagen_url, orden
       FROM galeria_negocio
       WHERE fk_negocio_id = $1
       ORDER BY orden ASC`,
      [id]
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener galeria', error: error.message })
  }
}

module.exports = { getByNegocio }