const pool = require('../db/db')

const getAll = async (req, res) => {
  const { search } = req.query
  try {
    let query = `
      SELECT pk_id, nombre, categoria, descripcion,
             direccion, distrito, whatsapp, logo_url,
             horario, telefono, rating, total_resenas,
             verificado,
             latitud, longitud
      FROM negocio
      WHERE activo = TRUE
    `
    const params = []
    if (search) {
      params.push(`%${search}%`)
      query += ` AND nombre ILIKE $${params.length}`
    }
    query += ' ORDER BY created_at DESC'
    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (error) {
    console.error('ERROR getAll negocios:', error.message)
    res.status(500).json({ message: 'Error al obtener negocios', error: error.message })
  }
}

const getById = async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      `SELECT pk_id, nombre, categoria, descripcion,
              direccion, distrito, whatsapp, logo_url, verificado,
              horario, telefono, rating, total_resenas,
              latitud, longitud
       FROM negocio
       WHERE pk_id = $1 AND activo = TRUE`,
      [id]
    )
    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Negocio no encontrado' })
    res.json(result.rows[0])
  } catch (error) {
    console.error('ERROR getById negocio:', error.message)
    res.status(500).json({ message: 'Error al obtener negocio', error: error.message })
  }
}

module.exports = { getAll, getById }