const pool = require('../config/db')

// ── Favoritos ──────────────────────────────────────────────────────
const getFavoritos = (clienteId) =>
  pool.query(
    `SELECT f.pk_id, p.pk_id as producto_id, p.nombre, p.precio, p.precio_oferta,
            p.imagen_url as img, n.nombre as negocio_nombre, n.pk_id as negocio_id, n.categoria
     FROM favorito f
     JOIN producto p ON f.fk_producto_id = p.pk_id
     JOIN negocio n  ON p.fk_negocio_id  = n.pk_id
     WHERE f.fk_cliente_id = $1 ORDER BY f.created_at DESC`,
    [clienteId]
  )

const findFavorito = (clienteId, productoId) =>
  pool.query(
    'SELECT pk_id FROM favorito WHERE fk_cliente_id=$1 AND fk_producto_id=$2',
    [clienteId, productoId]
  )

const addFavorito = (clienteId, productoId) =>
  pool.query(
    'INSERT INTO favorito (fk_cliente_id, fk_producto_id) VALUES ($1,$2)',
    [clienteId, productoId]
  )

const removeFavorito = (clienteId, productoId) =>
  pool.query(
    'DELETE FROM favorito WHERE fk_cliente_id=$1 AND fk_producto_id=$2',
    [clienteId, productoId]
  )

// ── Productos vistos ───────────────────────────────────────────────
const getVistos = (clienteId, limit) =>
  pool.query(
    `SELECT pv.visto_at, p.pk_id as producto_id, p.nombre, p.precio, p.precio_oferta,
            p.imagen_url as img, n.nombre as negocio_nombre, n.pk_id as negocio_id, n.categoria
     FROM producto_visto pv
     JOIN producto p ON pv.fk_producto_id = p.pk_id
     JOIN negocio n  ON p.fk_negocio_id   = n.pk_id
     WHERE pv.fk_cliente_id = $1 ORDER BY pv.visto_at DESC LIMIT $2`,
    [clienteId, limit]
  )

const upsertVisto = (clienteId, productoId) =>
  pool.query(
    `INSERT INTO producto_visto (fk_cliente_id, fk_producto_id, visto_at) VALUES ($1,$2,now())
     ON CONFLICT (fk_cliente_id, fk_producto_id) DO UPDATE SET visto_at = now()`,
    [clienteId, productoId]
  )

// ── Carrito ────────────────────────────────────────────────────────
const getCarrito = (clienteId) =>
  pool.query(
    `SELECT c.pk_id, c.cantidad, p.pk_id as producto_id, p.nombre, p.precio, p.precio_oferta,
            p.imagen_url as img, n.pk_id as negocio_id, n.nombre as negocio_nombre
     FROM carrito c
     JOIN producto p ON c.fk_producto_id = p.pk_id
     JOIN negocio n  ON c.fk_negocio_id  = n.pk_id
     WHERE c.fk_cliente_id = $1 ORDER BY c.updated_at DESC`,
    [clienteId]
  )

const upsertCarrito = (clienteId, productoId, negocioId, cantidad) =>
  pool.query(
    `INSERT INTO carrito (fk_cliente_id, fk_producto_id, fk_negocio_id, cantidad, updated_at)
     VALUES ($1,$2,$3,$4,now())
     ON CONFLICT (fk_cliente_id, fk_producto_id)
     DO UPDATE SET cantidad = carrito.cantidad + $4, updated_at = now()`,
    [clienteId, productoId, negocioId, cantidad]
  )

const updateCarritoCantidad = (clienteId, productoId, cantidad) =>
  pool.query(
    'UPDATE carrito SET cantidad=$1, updated_at=now() WHERE fk_cliente_id=$2 AND fk_producto_id=$3',
    [cantidad, clienteId, productoId]
  )

const removeCarritoItem = (clienteId, productoId) =>
  pool.query(
    'DELETE FROM carrito WHERE fk_cliente_id=$1 AND fk_producto_id=$2',
    [clienteId, productoId]
  )

const clearCarrito = (clienteId) =>
  pool.query('DELETE FROM carrito WHERE fk_cliente_id=$1', [clienteId])

// ── Descubrimiento ─────────────────────────────────────────────────
const getOfertas = () =>
  pool.query(
    `SELECT p.pk_id as producto_id, p.nombre, p.precio, p.precio_oferta,
            p.imagen_url as img, n.nombre as negocio_nombre, n.pk_id as negocio_id, n.categoria
     FROM producto p JOIN negocio n ON p.fk_negocio_id = n.pk_id
     WHERE p.precio_oferta IS NOT NULL AND p.precio_oferta < p.precio
       AND p.activo = TRUE AND n.activo = TRUE
     ORDER BY ((p.precio - p.precio_oferta) / p.precio) DESC LIMIT 8`
  )

const getParaTiPorCategorias = (categorias, limit) =>
  pool.query(
    `SELECT p.pk_id as producto_id, p.nombre, p.precio, p.precio_oferta,
            p.imagen_url as img, n.nombre as negocio_nombre, n.pk_id as negocio_id, n.categoria
     FROM producto p JOIN negocio n ON p.fk_negocio_id = n.pk_id
     WHERE n.categoria = ANY($1) AND p.activo = TRUE AND n.activo = TRUE
     ORDER BY RANDOM() LIMIT $2`,
    [categorias, limit]
  )

const getParaTiRandom = (limit) =>
  pool.query(
    `SELECT p.pk_id as producto_id, p.nombre, p.precio, p.precio_oferta,
            p.imagen_url as img, n.nombre as negocio_nombre, n.pk_id as negocio_id, n.categoria
     FROM producto p JOIN negocio n ON p.fk_negocio_id = n.pk_id
     WHERE p.activo = TRUE AND n.activo = TRUE ORDER BY RANDOM() LIMIT $1`,
    [limit]
  )

const getEconomicoPorCategorias = (categorias, limit) =>
  pool.query(
    `SELECT p.pk_id as producto_id, p.nombre, p.precio, p.precio_oferta,
            p.imagen_url as img, n.nombre as negocio_nombre, n.pk_id as negocio_id, n.categoria
     FROM producto p JOIN negocio n ON p.fk_negocio_id = n.pk_id
     WHERE n.categoria = ANY($1) AND p.activo = TRUE AND n.activo = TRUE
     ORDER BY COALESCE(p.precio_oferta, p.precio) ASC LIMIT $2`,
    [categorias, limit]
  )

const getEconomicoRandom = (limit) =>
  pool.query(
    `SELECT p.pk_id as producto_id, p.nombre, p.precio, p.precio_oferta,
            p.imagen_url as img, n.nombre as negocio_nombre, n.pk_id as negocio_id, n.categoria
     FROM producto p JOIN negocio n ON p.fk_negocio_id = n.pk_id
     WHERE p.activo = TRUE AND n.activo = TRUE
     ORDER BY COALESCE(p.precio_oferta, p.precio) ASC LIMIT $1`,
    [limit]
  )

const buscarProductos = (term, limit) =>
  pool.query(
    `SELECT p.pk_id, p.nombre, p.precio, p.precio_oferta, p.imagen_url as img,
            p.descripcion, n.pk_id as negocio_id, n.nombre as negocio_nombre, n.categoria
     FROM producto p JOIN negocio n ON p.fk_negocio_id = n.pk_id
     WHERE p.activo = TRUE AND n.activo = TRUE
       AND (p.nombre ILIKE $1 OR p.descripcion ILIKE $1 OR n.nombre ILIKE $1)
     ORDER BY p.nombre ASC LIMIT $2`,
    [term, limit]
  )

const buscarNegocios = (term, limit) =>
  pool.query(
    `SELECT pk_id, nombre, categoria, logo_url as img, descripcion, direccion
     FROM negocio WHERE activo = TRUE AND nombre ILIKE $1
     ORDER BY nombre ASC LIMIT $2`,
    [term, limit]
  )

module.exports = {
  getFavoritos, findFavorito, addFavorito, removeFavorito,
  getVistos, upsertVisto,
  getCarrito, upsertCarrito, updateCarritoCantidad, removeCarritoItem, clearCarrito,
  getOfertas, getParaTiPorCategorias, getParaTiRandom, getEconomicoPorCategorias, getEconomicoRandom,
  buscarProductos, buscarNegocios,
}
