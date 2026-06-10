const pool = require('../config/db')

const findByNegocio = (negocioId) =>
  pool.query(
    `SELECT pk_id, nombre, descripcion, precio, imagen_url, stock, categoria
     FROM producto
     WHERE fk_negocio_id = $1 AND activo = TRUE
     ORDER BY created_at ASC`,
    [negocioId]
  )

const findActivosParaChat = (negocioId, limit) =>
  pool.query(
    `SELECT nombre, descripcion, precio FROM producto
     WHERE fk_negocio_id = $1 AND activo = TRUE LIMIT $2`,
    [negocioId, limit]
  )

module.exports = { findByNegocio, findActivosParaChat }
