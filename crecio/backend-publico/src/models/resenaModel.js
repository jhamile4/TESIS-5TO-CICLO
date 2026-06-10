const pool = require('../config/db')

const findByNegocio = (negocioId) =>
  pool.query(
    `SELECT pk_id, nombre_autor, estrellas, texto, created_at
     FROM resena
     WHERE fk_negocio_id = $1
     ORDER BY created_at DESC`,
    [negocioId]
  )

module.exports = { findByNegocio }
