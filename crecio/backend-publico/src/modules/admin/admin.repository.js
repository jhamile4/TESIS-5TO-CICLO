const pool = require('../../config/db')

const findBusinessByOwner = (clienteId) =>
  pool.query(
    `SELECT pk_id, nombre, categoria, logo_url
     FROM negocio
     WHERE fk_cliente_id = $1
     LIMIT 1`,
    [clienteId]
  )

const getBusinessForAdmin = (clienteId) =>
  pool.query(
    `SELECT pk_id, nombre, categoria, descripcion, logo_url, direccion,
            distrito, horario, telefono, whatsapp
     FROM negocio WHERE fk_cliente_id = $1 LIMIT 1`,
    [clienteId]
  )

const updateBusiness = (clienteId, datos) =>
  pool.query(
    `UPDATE negocio SET nombre = $1, descripcion = $2, logo_url = $3,
            direccion = $4, whatsapp = $5
     WHERE fk_cliente_id = $6
     RETURNING pk_id, nombre, categoria, descripcion, logo_url, direccion,
               distrito, horario, telefono, whatsapp`,
    [datos.nombre, datos.descripcion, datos.logoUrl, datos.direccion, datos.whatsapp, clienteId]
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

const getSales = (negocioId) =>
  pool.query(
        `SELECT pp.pk_id, pp.numero_pedido, pp.monto_total, pp.estado,
          pp.stripe_payment_intent,
            pp.items, pp.created_at, pp.direccion, pp.ciudad,
            c.nombre AS cliente_nombre, c.email AS cliente_email
     FROM pedido_pago pp
     LEFT JOIN cliente c ON c.pk_id = pp.fk_cliente_id
     WHERE pp.fk_negocio_id = $1
     ORDER BY pp.created_at DESC`,
    [negocioId]
  )

const getClients = (negocioId) =>
  pool.query(
    `SELECT c.pk_id, c.nombre, c.email,
            COUNT(pp.pk_id)::int AS pedidos,
            COALESCE(SUM(pp.monto_total) FILTER (WHERE pp.estado = 'pagado'), 0) AS total_gastado,
            MAX(pp.created_at) AS ultima_compra,
            COUNT(*) FILTER (WHERE pp.created_at >= date_trunc('month', CURRENT_DATE))::int AS pedidos_mes
     FROM pedido_pago pp
     JOIN cliente c ON c.pk_id = pp.fk_cliente_id
     WHERE pp.fk_negocio_id = $1
     GROUP BY c.pk_id, c.nombre, c.email
     ORDER BY ultima_compra DESC`,
    [negocioId]
  )

const getFinanceSummary = (negocioId) =>
  pool.query(
    `SELECT
       COALESCE(SUM(monto_total) FILTER (WHERE estado = 'pagado' AND created_at::date = CURRENT_DATE), 0) AS ingresos_hoy,
       COALESCE(SUM(monto_total) FILTER (WHERE estado = 'pagado' AND created_at >= date_trunc('month', CURRENT_DATE)), 0) AS ingresos_mes,
       COUNT(*) FILTER (WHERE estado = 'pagado' AND created_at::date = CURRENT_DATE) AS operaciones_hoy,
       COUNT(*) FILTER (WHERE estado = 'pagado' AND created_at >= date_trunc('month', CURRENT_DATE)) AS operaciones_mes,
       COALESCE(SUM(monto_total) FILTER (WHERE estado = 'pagado' AND stripe_payment_intent IS NOT NULL AND created_at >= date_trunc('month', CURRENT_DATE)), 0) AS ingresos_tarjeta,
       COALESCE(SUM(monto_total) FILTER (WHERE estado = 'pagado' AND stripe_payment_intent IS NULL AND created_at >= date_trunc('month', CURRENT_DATE)), 0) AS ingresos_efectivo,
       COALESCE((SELECT SUM(monto) FROM gasto WHERE fk_negocio_id = $1 AND fecha = CURRENT_DATE), 0) AS gastos_hoy,
       COALESCE((SELECT SUM(monto) FROM gasto WHERE fk_negocio_id = $1 AND fecha >= date_trunc('month', CURRENT_DATE)::date), 0) AS gastos_mes
     FROM pedido_pago WHERE fk_negocio_id = $1`,
    [negocioId]
  )

const getFinanceTransactions = (negocioId) =>
  pool.query(
    `SELECT pp.pk_id, pp.numero_pedido, pp.monto_total, pp.estado, pp.stripe_payment_intent,
            pp.created_at, c.nombre AS cliente_nombre
     FROM pedido_pago pp LEFT JOIN cliente c ON c.pk_id = pp.fk_cliente_id
     WHERE pp.fk_negocio_id = $1 ORDER BY pp.created_at DESC LIMIT 8`,
    [negocioId]
  )

const createExpense = (negocioId, { descripcion, categoria, monto, fecha }) =>
  pool.query(
    `INSERT INTO gasto (fk_negocio_id, descripcion, categoria, monto, fecha)
     VALUES ($1, $2, $3, $4, COALESCE($5::date, CURRENT_DATE))
     RETURNING pk_id, descripcion, categoria, monto, fecha, created_at`,
    [negocioId, descripcion, categoria, monto, fecha || null]
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

const createProduct = (negocioId, { nombre, descripcion, precio, imagenUrl, stock, categoria }) =>
  pool.query(
    `INSERT INTO producto
       (fk_negocio_id, nombre, descripcion, precio, imagen_url, stock, categoria, activo)
     VALUES ($1,$2,$3,$4,$5,$6,$7,TRUE)
     RETURNING pk_id, nombre, descripcion, precio, imagen_url, stock, categoria`,
    [negocioId, nombre, descripcion || '', precio, imagenUrl || '', stock, categoria || 'General']
  )

const updateProduct = (negocioId, productoId, { nombre, descripcion, precio, imagenUrl, stock, categoria }) =>
  pool.query(
    `UPDATE producto
     SET nombre = $1, descripcion = $2, precio = $3, imagen_url = $4, stock = $5, categoria = $6
     WHERE pk_id = $7 AND fk_negocio_id = $8 AND activo = TRUE
     RETURNING pk_id, nombre, descripcion, precio, imagen_url, stock, categoria`,
    [nombre, descripcion || '', precio, imagenUrl || '', stock, categoria || 'General', productoId, negocioId]
  )

const deleteProduct = (negocioId, productoId) =>
  pool.query(
    `UPDATE producto
     SET activo = FALSE
     WHERE pk_id = $1 AND fk_negocio_id = $2
     RETURNING pk_id`,
    [productoId, negocioId]
  )

module.exports = {
  findBusinessByOwner,
  getBusinessForAdmin,
  updateBusiness,
  getMetrics,
  getProductCount,
  getWeeklySales,
  getRecentOrders,
  getSales,
  getClients,
  getFinanceSummary,
  getFinanceTransactions,
  createExpense,
  getBestSellingProducts,
  getInventoryProducts,
  getInventoryMetrics,
  createProduct,
  updateProduct,
  deleteProduct,
}

