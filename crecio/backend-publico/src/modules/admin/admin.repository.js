const pool = require('../../config/db')

const findBusinessByOwner = (clienteId) =>
  pool.query(
    `SELECT pk_id, nombre, categoria, logo_url
     FROM negocio
     WHERE fk_cliente_id = $1
     LIMIT 1`,
    [clienteId]
  )

const getMetrics = (negocioId) =>
  pool.query(
    `SELECT
       COALESCE(SUM(monto_total) FILTER (WHERE estado = 'pagado'), 0) AS ventas_totales,
       COUNT(*) FILTER (WHERE estado <> 'cancelado') AS ordenes,
       COUNT(DISTINCT fk_cliente_id) FILTER (WHERE fk_cliente_id IS NOT NULL) AS clientes
     FROM pedido_pago
     WHERE fk_negocio_id = $1`,
    [negocioId]
  )

const getProductCount = (negocioId) =>
  pool.query(
    `SELECT COUNT(*) AS productos
     FROM producto
     WHERE fk_negocio_id = $1 AND activo = TRUE`,
    [negocioId]
  )

const getWeeklySales = (negocioId) =>
  pool.query(
    `WITH dias AS (
       SELECT generate_series(
         CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, INTERVAL '1 day'
       )::date AS fecha
     )
     SELECT dias.fecha,
            COALESCE(SUM(pp.monto_total) FILTER (WHERE pp.estado = 'pagado'), 0) AS total
     FROM dias
     LEFT JOIN pedido_pago pp
       ON pp.fk_negocio_id = $1 AND pp.created_at::date = dias.fecha
     GROUP BY dias.fecha
     ORDER BY dias.fecha`,
    [negocioId]
  )

const getRecentOrders = (negocioId) =>
  pool.query(
    `SELECT pp.pk_id, pp.numero_pedido, pp.monto_total, pp.estado, pp.items, pp.created_at,
            c.nombre AS cliente_nombre
     FROM pedido_pago pp
     LEFT JOIN cliente c ON c.pk_id = pp.fk_cliente_id
     WHERE pp.fk_negocio_id = $1
     ORDER BY pp.created_at DESC
     LIMIT 6`,
    [negocioId]
  )

const getBestSellingProducts = (negocioId) =>
  pool.query(
    `SELECT item->>'nombre' AS nombre,
            SUM(COALESCE((item->>'cantidad')::int, 0)) AS ventas,
            SUM(COALESCE((item->>'cantidad')::numeric, 0) * COALESCE((item->>'precio')::numeric, 0)) AS total
     FROM pedido_pago pp
     CROSS JOIN LATERAL jsonb_array_elements(COALESCE(pp.items::jsonb, '[]'::jsonb)) AS item
     WHERE pp.fk_negocio_id = $1 AND pp.estado = 'pagado'
     GROUP BY item->>'nombre'
     ORDER BY ventas DESC, total DESC
     LIMIT 5`,
    [negocioId]
  )

const getInventoryProducts = (negocioId) =>
  pool.query(
    `SELECT pk_id, nombre, descripcion, precio, imagen_url, stock, categoria
     FROM producto
     WHERE fk_negocio_id = $1 AND activo = TRUE
     ORDER BY created_at ASC`,
    [negocioId]
  )

const getInventoryMetrics = (negocioId) =>
  pool.query(
    `SELECT COUNT(*) AS total_productos,
            COUNT(*) FILTER (WHERE stock <= 5) AS alertas_stock_bajo,
            COALESCE(SUM(stock), 0) AS unidades_stock,
            COALESCE(SUM(stock * precio), 0) AS valor_inventario
     FROM producto
     WHERE fk_negocio_id = $1 AND activo = TRUE`,
    [negocioId]
  )

module.exports = {
  findBusinessByOwner,
  getMetrics,
  getProductCount,
  getWeeklySales,
  getRecentOrders,
  getBestSellingProducts,
  getInventoryProducts,
  getInventoryMetrics,
}
