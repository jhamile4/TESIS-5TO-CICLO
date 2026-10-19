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
            distrito, horario, telefono, whatsapp, email_contacto, redes_sociales
     FROM negocio WHERE fk_cliente_id = $1 LIMIT 1`,
    [clienteId]
  )

const updateBusiness = (clienteId, datos) =>
  pool.query(
    `UPDATE negocio SET
       nombre = COALESCE($1, nombre),
       descripcion = COALESCE($2, descripcion),
       logo_url = COALESCE($3, logo_url),
       direccion = COALESCE($4, direccion),
       whatsapp = COALESCE($5, whatsapp),
       categoria = COALESCE($6, categoria),
       email_contacto = COALESCE($7, email_contacto),
       redes_sociales = COALESCE($8::jsonb, redes_sociales)
     WHERE fk_cliente_id = $9
     RETURNING pk_id, nombre, categoria, descripcion, logo_url, direccion,
               distrito, horario, telefono, whatsapp, email_contacto, redes_sociales`,
    [
      datos.nombre || null,
      datos.descripcion || null,
      datos.logoUrl || null,
      datos.direccion || null,
      datos.whatsapp || null,
      datos.categoria || null,
      datos.emailContacto || datos.email || null,
      datos.redesSociales ? JSON.stringify(datos.redesSociales) : null,
      clienteId
    ]
  )

const getMetrics = (negocioId) =>
  pool.query(
    `SELECT
       COALESCE(SUM(monto_total) FILTER (WHERE estado = 'pagado'), 0) AS ventas_totales,
       COUNT(*) FILTER (WHERE estado_pedido <> 'cancelado') AS ordenes,
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
            pp.estado_pedido, pp.estado_pedido_at, pp.tipo_entrega,
            pp.stripe_payment_intent, pp.metodo_pago, pp.comprobante_url,
            pp.telefono_cliente, pp.items, pp.notas, pp.created_at, pp.direccion, pp.ciudad,
            COALESCE(c.nombre, 'Cliente Directo') AS cliente_nombre,
            c.email AS cliente_email
     FROM pedido_pago pp
     LEFT JOIN cliente c ON c.pk_id = pp.fk_cliente_id
     WHERE pp.fk_negocio_id = $1
     ORDER BY pp.created_at DESC`,
    [negocioId]
  )

const createSale = (negocioId, { clienteNombre, clienteTelefono, metodoPago, comprobanteUrl, items, nota, montoTotal }, db = pool) =>
  db.query(
    `INSERT INTO pedido_pago (
       fk_negocio_id, numero_pedido, monto_total, estado, metodo_pago,
       comprobante_url, telefono_cliente, items, notas, created_at,
       estado_pedido, tipo_entrega
     )
     VALUES (
       $1,
       'VTA-' || LPAD(FLOOR(RANDOM() * 9000 + 1000)::text, 4, '0'),
       $2,
       'pagado',
       $3,
       $4,
       $5,
       $6::jsonb,
       $7,
       NOW(),
       'entregado',
       'recojo'
     )
     RETURNING pk_id, numero_pedido, monto_total, estado, estado_pedido, tipo_entrega, metodo_pago, comprobante_url, telefono_cliente, items, notas, created_at`,
    [
      negocioId,
      Number(montoTotal) || 0,
      metodoPago || 'Efectivo',
      comprobanteUrl || null,
      clienteTelefono || null,
      JSON.stringify(items || []),
      nota || null
    ]
  )

// Bloquea la fila mientras se cambia el estado, para evitar cambios simultáneos
const findOrderForUpdate = (dbClient, negocioId, pedidoId) =>
  dbClient.query(
    `SELECT pp.pk_id, pp.numero_pedido, pp.estado, pp.estado_pedido, pp.tipo_entrega,
            pp.stripe_payment_intent, pp.items, pp.monto_total,
            c.email AS cliente_email, c.nombre AS cliente_nombre
     FROM pedido_pago pp
     LEFT JOIN cliente c ON c.pk_id = pp.fk_cliente_id
     WHERE pp.pk_id = $1 AND pp.fk_negocio_id = $2
     FOR UPDATE OF pp`,
    [pedidoId, negocioId]
  )

const updateOrderStatus = (dbClient, pedidoId, estadoPedido, estadoPago) =>
  dbClient.query(
    `UPDATE pedido_pago
     SET estado_pedido = $1, estado = $2, estado_pedido_at = NOW()
     WHERE pk_id = $3
     RETURNING pk_id, numero_pedido, estado, estado_pedido, estado_pedido_at, tipo_entrega`,
    [estadoPedido, estadoPago, pedidoId]
  )

// Notificaciones: se calculan de los datos; "leída" = anterior a la última vez que el dueño las marcó
const getOrderNotifications = (negocioId) =>
  pool.query(
    `SELECT pp.pk_id, pp.numero_pedido, pp.monto_total, pp.tipo_entrega, pp.created_at,
            pp.created_at <= n.notificaciones_leidas_at AS leida
     FROM pedido_pago pp
     JOIN negocio n ON n.pk_id = pp.fk_negocio_id
     WHERE pp.fk_negocio_id = $1
       AND pp.estado <> 'pendiente'
       AND pp.numero_pedido NOT LIKE 'VTA-%'
       AND pp.created_at > NOW() - INTERVAL '30 days'
     ORDER BY pp.created_at DESC
     LIMIT 15`,
    [negocioId]
  )

const getReviewNotifications = (negocioId) =>
  pool.query(
    `SELECT r.pk_id, r.nombre_autor, r.estrellas, r.created_at,
            r.created_at <= n.notificaciones_leidas_at AS leida
     FROM resena r
     JOIN negocio n ON n.pk_id = r.fk_negocio_id
     WHERE r.fk_negocio_id = $1 AND r.created_at > NOW() - INTERVAL '30 days'
     ORDER BY r.created_at DESC
     LIMIT 10`,
    [negocioId]
  )

const getLowStockProducts = (negocioId) =>
  pool.query(
    `SELECT pk_id, nombre, stock FROM producto
     WHERE fk_negocio_id = $1 AND activo = TRUE AND stock <= 5
     ORDER BY stock ASC, nombre
     LIMIT 10`,
    [negocioId]
  )

const markNotificationsRead = (negocioId) =>
  pool.query('UPDATE negocio SET notificaciones_leidas_at = NOW() WHERE pk_id = $1', [negocioId])

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
       COALESCE(SUM(monto_total) FILTER (WHERE estado = 'pagado' AND stripe_payment_intent IS NOT NULL AND created_at::date = CURRENT_DATE), 0) AS ingresos_tarjeta_hoy,
       COALESCE(SUM(monto_total) FILTER (WHERE estado = 'pagado' AND stripe_payment_intent IS NULL AND created_at::date = CURRENT_DATE), 0) AS ingresos_efectivo_hoy,
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


const getMarketingPosts = (negocioId, estado) => {
  if (estado) {
    return pool.query(
      `SELECT pk_id, tipo_contenido, plantilla, tono, prompt_usado, caption, guion_video, media_url, plataformas, estado, fecha_programada, fecha_publicada, resultado_publicacion, likes, comments, shares, created_at
       FROM publicacion_marketing
       WHERE fk_negocio_id = $1 AND estado = $2
       ORDER BY created_at DESC`,
      [negocioId, estado]
    )
  }
  return pool.query(
    `SELECT pk_id, tipo_contenido, plantilla, tono, prompt_usado, caption, guion_video, media_url, plataformas, estado, fecha_programada, fecha_publicada, resultado_publicacion, likes, comments, shares, created_at
     FROM publicacion_marketing
     WHERE fk_negocio_id = $1
     ORDER BY created_at DESC`,
    [negocioId]
  )
}

const createMarketingPost = (negocioId, { tipoContenido, plantilla, tono, promptUsado, caption, guionVideo, mediaUrl, plataformas, estado, fechaProgramada }) =>
  pool.query(
    `INSERT INTO publicacion_marketing
       (fk_negocio_id, tipo_contenido, plantilla, tono, prompt_usado, caption, guion_video, media_url, plataformas, estado, fecha_programada)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING *`,
    [negocioId, tipoContenido, plantilla || '', tono || '', promptUsado || '', caption, guionVideo ? JSON.stringify(guionVideo) : null, mediaUrl || '', plataformas || [], estado || 'borrador', fechaProgramada || null]
  )

const updateMarketingPostStatus = (negocioId, postId, estado, resultadoPublicacion = null) =>
  pool.query(
    `UPDATE publicacion_marketing
     SET estado = $1::varchar,
         fecha_publicada = CASE WHEN $1::varchar = 'publicado' THEN NOW() ELSE fecha_publicada END,
         resultado_publicacion = $2::jsonb
     WHERE pk_id = $3 AND fk_negocio_id = $4
     RETURNING *`,
    [estado, resultadoPublicacion ? JSON.stringify(resultadoPublicacion) : null, postId, negocioId]
  )

// Solo se pueden cancelar las que aún no se publicaron
const deleteMarketingPost = (negocioId, postId) =>
  pool.query(
    `DELETE FROM publicacion_marketing
     WHERE pk_id = $1 AND fk_negocio_id = $2 AND estado IN ('programado', 'fallido')
     RETURNING pk_id`,
    [postId, negocioId]
  )

// Toma las programadas cuya hora ya llegó y las marca "publicando" en un solo paso,
// para que dos procesos nunca publiquen la misma dos veces
const claimDueScheduledPosts = (limite = 10) =>
  pool.query(
    `UPDATE publicacion_marketing SET estado = 'publicando'
     WHERE pk_id IN (
       SELECT pk_id FROM publicacion_marketing
       WHERE estado = 'programado' AND fecha_programada <= NOW()
       ORDER BY fecha_programada
       LIMIT $1
       FOR UPDATE SKIP LOCKED
     )
     RETURNING pk_id, fk_negocio_id, tipo_contenido, caption, media_url, plataformas`,
    [limite]
  )

// Si el servidor se apagó a mitad de una publicación, no se reintenta (podría duplicarse)
const failStuckPublishingPosts = () =>
  pool.query(
    `UPDATE publicacion_marketing
     SET estado = 'fallido',
         resultado_publicacion = '{"resultados": [], "errores": [{"plataforma": "general", "error": "Se interrumpió mientras se publicaba. Revisa tus redes antes de volver a programarla."}]}'::jsonb
     WHERE estado = 'publicando' AND fecha_programada < NOW() - INTERVAL '15 minutes'
     RETURNING pk_id`
  )

// "vinculada" = tiene token de Meta y se puede publicar en ella (el token nunca se envía al navegador)
const getSocialAccounts = (negocioId) =>
  pool.query(
    `SELECT pk_id, plataforma, cuenta_id_externa, nombre_cuenta, handle, estado, created_at,
            (access_token IS NOT NULL AND access_token <> '') AS vinculada
     FROM red_social_cuenta
     WHERE fk_negocio_id = $1
     ORDER BY created_at ASC`,
    [negocioId]
  )

// Solo para publicar desde el servidor
const getSocialTokens = (negocioId, plataformas) =>
  pool.query(
    `SELECT plataforma, cuenta_id_externa, access_token
     FROM red_social_cuenta
     WHERE fk_negocio_id = $1 AND plataforma = ANY($2::text[])
       AND access_token IS NOT NULL AND access_token <> '' AND cuenta_id_externa <> ''`,
    [negocioId, plataformas]
  )

const deleteSocialAccount = (negocioId, cuentaId) =>
  pool.query('DELETE FROM red_social_cuenta WHERE pk_id = $1 AND fk_negocio_id = $2 RETURNING pk_id', [cuentaId, negocioId])

const upsertSocialAccount = async (negocioId, { plataforma, cuentaIdExterna, nombreCuenta, handle, accessToken, estado }) => {
  await pool.query(
    `DELETE FROM red_social_cuenta WHERE fk_negocio_id = $1 AND plataforma = $2`,
    [negocioId, plataforma]
  )
  return pool.query(
    `INSERT INTO red_social_cuenta (fk_negocio_id, plataforma, cuenta_id_externa, nombre_cuenta, handle, access_token, estado)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING pk_id, plataforma, cuenta_id_externa, nombre_cuenta, handle, estado, created_at,
               (access_token <> '') AS vinculada`,
    [negocioId, plataforma, cuentaIdExterna || '', nombreCuenta || plataforma, handle || '', accessToken || '', estado || 'conectado']
  )
}

module.exports = {
  findBusinessByOwner,
  getBusinessForAdmin,
  updateBusiness,
  getMetrics,
  getProductCount,
  getWeeklySales,
  getRecentOrders,
  getSales,
  createSale,
  findOrderForUpdate,
  updateOrderStatus,
  getOrderNotifications,
  getReviewNotifications,
  getLowStockProducts,
  markNotificationsRead,
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
  getMarketingPosts,
  createMarketingPost,
  updateMarketingPostStatus,
  deleteMarketingPost,
  claimDueScheduledPosts,
  failStuckPublishingPosts,
  getSocialAccounts,
  getSocialTokens,
  deleteSocialAccount,
  upsertSocialAccount,
}


