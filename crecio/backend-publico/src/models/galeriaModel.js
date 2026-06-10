const pool = require('../config/db')

const findByNegocio = (negocioId) =>
  pool.query(
    `SELECT imagen_url, orden
     FROM galeria_negocio
     WHERE fk_negocio_id = $1
     ORDER BY orden ASC`,
    [negocioId]
  )

module.exports = { findByNegocio }
