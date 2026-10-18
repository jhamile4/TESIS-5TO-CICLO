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

const findByIds = (negocioId, ids) =>
  pool.query(
    `SELECT pk_id, nombre, precio, stock FROM producto
     WHERE fk_negocio_id = $1 AND pk_id = ANY($2::int[]) AND activo = TRUE`,
    [negocioId, ids]
  )

// Descuenta solo si hay stock suficiente; devuelve 0 filas si no alcanza
const descontarStock = (dbClient, negocioId, productoId, cantidad) =>
  dbClient.query(
    `UPDATE producto SET stock = stock - $1
     WHERE pk_id = $2 AND fk_negocio_id = $3 AND stock >= $1
     RETURNING pk_id`,
    [cantidad, productoId, negocioId]
  )

// Para pagos ya cobrados: nunca falla, como mínimo deja el stock en 0
const descontarStockForzado = (dbClient, negocioId, productoId, cantidad) =>
  dbClient.query(
    `UPDATE producto SET stock = GREATEST(stock - $1, 0)
     WHERE pk_id = $2 AND fk_negocio_id = $3`,
    [cantidad, productoId, negocioId]
  )

const findIdByNombre = (dbClient, negocioId, nombre) =>
  dbClient.query(
    `SELECT pk_id FROM producto
     WHERE fk_negocio_id = $1 AND LOWER(TRIM(nombre)) = LOWER(TRIM($2)) AND activo = TRUE
     LIMIT 1`,
    [negocioId, nombre]
  )

module.exports = {
  findByNegocio,
  findActivosParaChat,
  findByIds,
  descontarStock,
  descontarStockForzado,
  findIdByNombre,
}
