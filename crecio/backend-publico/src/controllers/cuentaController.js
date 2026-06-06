const pool = require('../db/db')

const getFavoritos = async (req, res) => {
  const { id } = req.user
  try {
    const result = await pool.query(
      `SELECT f.pk_id, p.pk_id as producto_id, p.nombre, p.precio, p.precio_oferta,
              p.imagen_url as img, n.nombre as negocio_nombre, n.pk_id as negocio_id, n.categoria
       FROM favorito f
       JOIN producto p ON f.fk_producto_id = p.pk_id
       JOIN negocio n ON p.fk_negocio_id = n.pk_id
       WHERE f.fk_cliente_id = $1 ORDER BY f.created_at DESC`, [id])
    res.json(result.rows)
  } catch (error) { res.status(500).json({ message: 'Error', error: error.message }) }
}

const toggleFavorito = async (req, res) => {
  const { id } = req.user
  const { producto_id } = req.body
  try {
    const existe = await pool.query('SELECT pk_id FROM favorito WHERE fk_cliente_id=$1 AND fk_producto_id=$2', [id, producto_id])
    if (existe.rows.length > 0) {
      await pool.query('DELETE FROM favorito WHERE fk_cliente_id=$1 AND fk_producto_id=$2', [id, producto_id])
      res.json({ favorito: false })
    } else {
      await pool.query('INSERT INTO favorito (fk_cliente_id, fk_producto_id) VALUES ($1,$2)', [id, producto_id])
      res.json({ favorito: true })
    }
  } catch (error) { res.status(500).json({ message: 'Error', error: error.message }) }
}

const getVistos = async (req, res) => {
  const { id } = req.user
  try {
    const result = await pool.query(
      `SELECT pv.visto_at, p.pk_id as producto_id, p.nombre, p.precio, p.precio_oferta,
              p.imagen_url as img, n.nombre as negocio_nombre, n.pk_id as negocio_id, n.categoria
       FROM producto_visto pv
       JOIN producto p ON pv.fk_producto_id = p.pk_id
       JOIN negocio n ON p.fk_negocio_id = n.pk_id
       WHERE pv.fk_cliente_id = $1 ORDER BY pv.visto_at DESC LIMIT 10`, [id])
    res.json(result.rows)
  } catch (error) { res.status(500).json({ message: 'Error', error: error.message }) }
}

const registrarVisto = async (req, res) => {
  const { id } = req.user
  const { producto_id } = req.body
  try {
    await pool.query(
      `INSERT INTO producto_visto (fk_cliente_id, fk_producto_id, visto_at) VALUES ($1,$2,now())
       ON CONFLICT (fk_cliente_id, fk_producto_id) DO UPDATE SET visto_at = now()`,
      [id, producto_id])
    res.json({ message: 'Registrado' })
  } catch (error) { res.status(500).json({ message: 'Error', error: error.message }) }
}

const getOfertas = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.pk_id as producto_id, p.nombre, p.precio, p.precio_oferta,
              p.imagen_url as img, n.nombre as negocio_nombre, n.pk_id as negocio_id, n.categoria
       FROM producto p JOIN negocio n ON p.fk_negocio_id = n.pk_id
       WHERE p.precio_oferta IS NOT NULL AND p.precio_oferta < p.precio
         AND p.activo = TRUE AND n.activo = TRUE
       ORDER BY ((p.precio - p.precio_oferta) / p.precio) DESC LIMIT 8`)
    res.json(result.rows)
  } catch (error) { res.status(500).json({ message: 'Error', error: error.message }) }
}

const getParaTi = async (req, res) => {
  const { id } = req.user
  try {
    const categoriasResult = await pool.query(
      `SELECT DISTINCT n.categoria FROM pedido_pago pp
       JOIN negocio n ON pp.fk_negocio_id = n.pk_id
       WHERE pp.fk_cliente_id = $1 AND pp.estado = 'pagado'`, [id])
    const categorias = categoriasResult.rows.map(r => r.categoria)
    let query, params
    if (categorias.length > 0) {
      query  = `SELECT p.pk_id as producto_id, p.nombre, p.precio, p.precio_oferta, p.imagen_url as img,
                       n.nombre as negocio_nombre, n.pk_id as negocio_id, n.categoria
                FROM producto p JOIN negocio n ON p.fk_negocio_id = n.pk_id
                WHERE n.categoria = ANY($1) AND p.activo = TRUE AND n.activo = TRUE
                ORDER BY RANDOM() LIMIT 6`
      params = [categorias]
    } else {
      query  = `SELECT p.pk_id as producto_id, p.nombre, p.precio, p.precio_oferta, p.imagen_url as img,
                       n.nombre as negocio_nombre, n.pk_id as negocio_id, n.categoria
                FROM producto p JOIN negocio n ON p.fk_negocio_id = n.pk_id
                WHERE p.activo = TRUE AND n.activo = TRUE ORDER BY RANDOM() LIMIT 6`
      params = []
    }
    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (error) { res.status(500).json({ message: 'Error', error: error.message }) }
}

const getCarrito = async (req, res) => {
  const { id } = req.user
  try {
    const result = await pool.query(
      `SELECT c.pk_id, c.cantidad, p.pk_id as producto_id, p.nombre, p.precio, p.precio_oferta,
              p.imagen_url as img, n.pk_id as negocio_id, n.nombre as negocio_nombre
       FROM carrito c
       JOIN producto p ON c.fk_producto_id = p.pk_id
       JOIN negocio n ON c.fk_negocio_id = n.pk_id
       WHERE c.fk_cliente_id = $1 ORDER BY c.updated_at DESC`, [id])
    res.json(result.rows)
  } catch (error) { res.status(500).json({ message: 'Error', error: error.message }) }
}

const agregarAlCarrito = async (req, res) => {
  const { id } = req.user
  const { producto_id, negocio_id, cantidad = 1 } = req.body
  try {
    await pool.query(
      `INSERT INTO carrito (fk_cliente_id, fk_producto_id, fk_negocio_id, cantidad, updated_at)
       VALUES ($1,$2,$3,$4,now())
       ON CONFLICT (fk_cliente_id, fk_producto_id)
       DO UPDATE SET cantidad = carrito.cantidad + $4, updated_at = now()`,
      [id, producto_id, negocio_id, cantidad])
    res.json({ message: 'Agregado' })
  } catch (error) { res.status(500).json({ message: 'Error', error: error.message }) }
}

const actualizarCarrito = async (req, res) => {
  const { id } = req.user
  const { producto_id, cantidad } = req.body
  try {
    if (cantidad <= 0) {
      await pool.query('DELETE FROM carrito WHERE fk_cliente_id=$1 AND fk_producto_id=$2', [id, producto_id])
    } else {
      await pool.query('UPDATE carrito SET cantidad=$1, updated_at=now() WHERE fk_cliente_id=$2 AND fk_producto_id=$3', [cantidad, id, producto_id])
    }
    res.json({ message: 'Actualizado' })
  } catch (error) { res.status(500).json({ message: 'Error', error: error.message }) }
}

const limpiarCarrito = async (req, res) => {
  const { id } = req.user
  try {
    await pool.query('DELETE FROM carrito WHERE fk_cliente_id=$1', [id])
    res.json({ message: 'Limpiado' })
  } catch (error) { res.status(500).json({ message: 'Error', error: error.message }) }
}

const buscar = async (req, res) => {
  const { q } = req.query
  if (!q || q.trim().length < 2) return res.json({ productos: [], negocios: [] })
  const term = `%${q.trim()}%`
  try {
    const [productosResult, negociosResult] = await Promise.all([
      pool.query(
        `SELECT p.pk_id, p.nombre, p.precio, p.precio_oferta, p.imagen_url as img,
                p.descripcion, n.pk_id as negocio_id, n.nombre as negocio_nombre, n.categoria
         FROM producto p JOIN negocio n ON p.fk_negocio_id = n.pk_id
         WHERE p.activo = TRUE AND n.activo = TRUE
           AND (p.nombre ILIKE $1 OR p.descripcion ILIKE $1 OR n.nombre ILIKE $1)
         ORDER BY p.nombre ASC LIMIT 8`, [term]),
      pool.query(
        `SELECT pk_id, nombre, categoria, logo_url as img, descripcion, direccion
         FROM negocio WHERE activo = TRUE AND nombre ILIKE $1
         ORDER BY nombre ASC LIMIT 4`, [term])
    ])
    res.json({ productos: productosResult.rows, negocios: negociosResult.rows })
  } catch (error) { res.status(500).json({ message: 'Error al buscar', error: error.message }) }
}

module.exports = {
  getFavoritos, toggleFavorito,
  getVistos, registrarVisto,
  getOfertas, getParaTi,
  getCarrito, agregarAlCarrito, actualizarCarrito, limpiarCarrito,
  buscar,
}