const pool = require('../../config/db')
const repository = require('./admin.repository')
const socialPublisher = require('../../services/socialPublisherService')
const Groq = require('groq-sdk')
const { GROQ_MODEL } = require('../../config/constants')
const productoModel = require('../../models/productoModel')
const Stripe = require('stripe')
const { enviarEstadoPedido } = require('../../utils/email')
const { asegurarUrlPublica } = require('../../utils/storage')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const getResumen = async (clienteId) => {
  const negocioResult = await repository.findBusinessByOwner(clienteId)
  if (negocioResult.rows.length === 0) {
    throw { status: 403, message: 'Esta cuenta no tiene un negocio para administrar' }
  }

  const negocio = negocioResult.rows[0]
  const [metricas, productos, ventasSemana, pedidosRecientes, productosMasVendidos] = await Promise.all([
    repository.getMetrics(negocio.pk_id),
    repository.getProductCount(negocio.pk_id),
    repository.getWeeklySales(negocio.pk_id),
    repository.getRecentOrders(negocio.pk_id),
    repository.getBestSellingProducts(negocio.pk_id),
  ])

  return {
    negocio: {
      id: negocio.pk_id,
      nombre: negocio.nombre,
      categoria: negocio.categoria,
      logoUrl: negocio.logo_url,
    },
    metricas: {
      ventasTotales: Number(metricas.rows[0].ventas_totales),
      ordenes: Number(metricas.rows[0].ordenes),
      clientes: Number(metricas.rows[0].clientes),
      productos: Number(productos.rows[0].productos),
    },
    ventasSemana: ventasSemana.rows.map((venta) => ({
      fecha: venta.fecha,
      total: Number(venta.total),
    })),
    pedidosRecientes: pedidosRecientes.rows,
    productosMasVendidos: productosMasVendidos.rows.map((producto) => ({
      ...producto,
      ventas: Number(producto.ventas),
      total: Number(producto.total),
    })),
  }
}

const getInventario = async (clienteId) => {
  const negocioResult = await repository.findBusinessByOwner(clienteId)
  if (negocioResult.rows.length === 0) {
    throw { status: 403, message: 'Esta cuenta no tiene un negocio para administrar' }
  }

  const negocio = negocioResult.rows[0]
  const negocioId = negocio.pk_id
  const [productosResult, metricasResult] = await Promise.all([
    repository.getInventoryProducts(negocioId),
    repository.getInventoryMetrics(negocioId),
  ])
  const metricas = metricasResult.rows[0]

  return {
    negocio: {
      id: negocio.pk_id,
      nombre: negocio.nombre,
      logoUrl: negocio.logo_url,
    },
    productos: productosResult.rows,
    metricas: {
      totalProductos: Number(metricas.total_productos),
      alertasStockBajo: Number(metricas.alertas_stock_bajo),
      unidadesStock: Number(metricas.unidades_stock),
      valorInventario: Number(metricas.valor_inventario),
    },
  }
}

const getTienda = async (clienteId) => {
  const negocioResult = await repository.getBusinessForAdmin(clienteId)
  if (negocioResult.rows.length === 0) throw { status: 403, message: 'Esta cuenta no tiene un negocio para administrar' }
  const negocio = negocioResult.rows[0]
  const productosResult = await repository.getInventoryProducts(negocio.pk_id)
  return { negocio, productos: productosResult.rows.slice(0, 6) }
}

const updateTienda = async (clienteId, datos) => {
  const required = ['nombre', 'descripcion', 'direccion', 'whatsapp']
  if (required.some((field) => typeof datos[field] !== 'string')) throw { status: 400, message: 'Completa los datos de la tienda' }
  const result = await repository.updateBusiness(clienteId, {
    nombre: datos.nombre.trim(),
    descripcion: datos.descripcion.trim(),
    direccion: datos.direccion.trim(),
    whatsapp: datos.whatsapp.trim(),
    logoUrl: (datos.logoUrl || '').trim(),
    categoria: datos.categoria || 'Ropa y Accesorios',
    redesSociales: datos.redesSociales || {}
  })
  if (result.rows.length === 0) throw { status: 403, message: 'Esta cuenta no tiene un negocio para administrar' }

  // Sincronizar automáticamente cada red social ingresada en Configuración con red_social_cuenta
  if (datos.redesSociales && typeof datos.redesSociales === 'object') {
    const negocioId = result.rows[0].pk_id
    for (const [plataforma, handle] of Object.entries(datos.redesSociales)) {
      if (handle && typeof handle === 'string' && handle.trim()) {
        await repository.upsertSocialAccount(negocioId, {
          plataforma,
          nombreCuenta: plataforma.charAt(0).toUpperCase() + plataforma.slice(1),
          handle: handle.trim(),
          estado: 'conectado'
        }).catch(() => {})
      }
    }
  }

  return { negocio: result.rows[0] }
}


const createProduct = async (clienteId, datos) => {
  const negocioResult = await repository.findBusinessByOwner(clienteId)
  if (negocioResult.rows.length === 0) {
    throw { status: 403, message: 'Esta cuenta no tiene un negocio para administrar' }
  }

  const { nombre, precio, stock } = datos
  if (!nombre?.trim() || !Number.isFinite(Number(precio)) || Number(precio) < 0 || !Number.isInteger(Number(stock)) || Number(stock) < 0) {
    throw { status: 400, message: 'Nombre, precio y stock son obligatorios y deben ser validos' }
  }

  const result = await repository.createProduct(negocioResult.rows[0].pk_id, {
    ...datos,
    nombre: nombre.trim(),
    precio: Number(precio),
    stock: Number(stock),
  })
  return result.rows[0]
}

const updateProduct = async (clienteId, productoId, datos) => {
  const negocioResult = await repository.findBusinessByOwner(clienteId)
  if (negocioResult.rows.length === 0) throw { status: 403, message: 'Esta cuenta no tiene un negocio para administrar' }

  const { nombre, precio, stock } = datos
  if (!nombre?.trim() || !Number.isFinite(Number(precio)) || Number(precio) < 0 || !Number.isInteger(Number(stock)) || Number(stock) < 0) {
    throw { status: 400, message: 'Nombre, precio y stock son obligatorios y deben ser validos' }
  }

  const result = await repository.updateProduct(negocioResult.rows[0].pk_id, productoId, {
    ...datos,
    nombre: nombre.trim(),
    precio: Number(precio),
    stock: Number(stock),
  })
  if (result.rows.length === 0) throw { status: 404, message: 'Producto no encontrado' }
  return result.rows[0]
}

const deleteProduct = async (clienteId, productoId) => {
  const negocioResult = await repository.findBusinessByOwner(clienteId)
  if (negocioResult.rows.length === 0) throw { status: 403, message: 'Esta cuenta no tiene un negocio para administrar' }

  const result = await repository.deleteProduct(negocioResult.rows[0].pk_id, productoId)
  if (result.rows.length === 0) throw { status: 404, message: 'Producto no encontrado' }
  return { id: productoId, eliminado: true }
}


const getVentas = async (clienteId) => {
  const negocioResult = await repository.findBusinessByOwner(clienteId)
  if (negocioResult.rows.length === 0) {
    throw { status: 403, message: 'Esta cuenta no tiene un negocio para administrar' }
  }

  const negocio = negocioResult.rows[0]
  const ventasResult = await repository.getSales(negocio.pk_id)
  return {
    negocio: { id: negocio.pk_id, nombre: negocio.nombre, logoUrl: negocio.logo_url },
    ventas: ventasResult.rows,
  }
}

const createSale = async (clienteId, data) => {
  const negocioResult = await repository.findBusinessByOwner(clienteId)
  if (negocioResult.rows.length === 0) {
    throw { status: 403, message: 'Esta cuenta no tiene un negocio para administrar' }
  }
  const negocio = negocioResult.rows[0]
  const items = (data.items || []).filter((item) => item.nombre && Number(item.cantidad) > 0)
  if (items.length === 0) throw { status: 400, message: 'Agrega al menos un producto a la venta' }
  const montoTotal = items.reduce((sum, item) => sum + Number(item.cantidad) * (Number(item.precio) || 0), 0)

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Si el producto existe en el inventario (por id o nombre), se descuenta su stock
    for (const item of items) {
      const productoId = item.pk_id || (await productoModel.findIdByNombre(client, negocio.pk_id, item.nombre)).rows[0]?.pk_id
      if (!productoId) continue
      item.pk_id = productoId
      const descuento = await productoModel.descontarStock(client, negocio.pk_id, productoId, Number(item.cantidad))
      if (descuento.rowCount === 0)
        throw { status: 409, message: `Stock insuficiente para "${item.nombre}"` }
    }

    const result = await repository.createSale(negocio.pk_id, { ...data, items, montoTotal }, client)
    await client.query('COMMIT')
    return result.rows[0]
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

// Flujo del pedido según el tipo de entrega (el delivery lo hace el propio negocio)
const SIGUIENTES_ESTADOS = {
  delivery: { recibido: ['preparando', 'cancelado'], preparando: ['en_camino', 'cancelado'], en_camino: ['entregado'] },
  recojo:   { recibido: ['preparando', 'cancelado'], preparando: ['listo_recojo', 'cancelado'], listo_recojo: ['entregado', 'cancelado'] },
}

const updateOrderStatus = async (clienteId, pedidoId, nuevoEstado) => {
  const negocioResult = await repository.findBusinessByOwner(clienteId)
  if (negocioResult.rows.length === 0) {
    throw { status: 403, message: 'Esta cuenta no tiene un negocio para administrar' }
  }
  const negocio = negocioResult.rows[0]

  const client = await pool.connect()
  let pedido
  let actualizado
  try {
    await client.query('BEGIN')

    const pedidoResult = await repository.findOrderForUpdate(client, negocio.pk_id, pedidoId)
    if (pedidoResult.rows.length === 0) throw { status: 404, message: 'Pedido no encontrado' }
    pedido = pedidoResult.rows[0]

    if (pedido.estado === 'pendiente')
      throw { status: 400, message: 'Este pedido aún no ha sido pagado por el cliente' }

    const permitidos = SIGUIENTES_ESTADOS[pedido.tipo_entrega]?.[pedido.estado_pedido] || []
    if (!permitidos.includes(nuevoEstado))
      throw { status: 400, message: `No se puede pasar de "${pedido.estado_pedido}" a "${nuevoEstado}"` }

    let estadoPago = pedido.estado
    // En efectivo el cliente paga al recibir, así que al entregar queda pagado
    if (nuevoEstado === 'entregado' && pedido.estado === 'efectivo') estadoPago = 'pagado'

    if (nuevoEstado === 'cancelado') {
      for (const item of pedido.items || []) {
        if (item.pk_id) await productoModel.devolverStock(client, negocio.pk_id, item.pk_id, Number(item.cantidad))
      }
      if (pedido.stripe_payment_intent && pedido.estado === 'pagado') {
        await stripe.refunds.create({ payment_intent: pedido.stripe_payment_intent })
        estadoPago = 'reembolsado'
      }
    }

    actualizado = (await repository.updateOrderStatus(client, pedido.pk_id, nuevoEstado, estadoPago)).rows[0]
    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }

  // El correo es un aviso: si falla, el cambio de estado igual queda guardado
  if (pedido.cliente_email) {
    enviarEstadoPedido(pedido.cliente_email, {
      cliente: pedido.cliente_nombre,
      negocio: negocio.nombre,
      numeroPedido: pedido.numero_pedido,
      estado: nuevoEstado,
      tipoEntrega: pedido.tipo_entrega,
    }).catch((err) => console.error('No se pudo enviar el correo de estado:', err.message))
  }

  return actualizado
}

const getNotificaciones = async (clienteId) => {
  const negocioResult = await repository.findBusinessByOwner(clienteId)
  if (negocioResult.rows.length === 0) {
    throw { status: 403, message: 'Esta cuenta no tiene un negocio para administrar' }
  }
  const negocioId = negocioResult.rows[0].pk_id

  const [pedidos, resenas, stockBajo] = await Promise.all([
    repository.getOrderNotifications(negocioId),
    repository.getReviewNotifications(negocioId),
    repository.getLowStockProducts(negocioId),
  ])

  const eventos = [
    ...pedidos.rows.map((p) => ({
      id: `pedido-${p.pk_id}`,
      tipo: 'pedido',
      texto: `Nuevo pedido #${p.numero_pedido} por S/ ${Number(p.monto_total).toFixed(2)} · ${p.tipo_entrega === 'recojo' ? 'recojo en tienda' : 'delivery'}`,
      fecha: p.created_at,
      leida: p.leida,
      link: '/ventas',
    })),
    ...resenas.rows.map((r) => ({
      id: `resena-${r.pk_id}`,
      tipo: 'resena',
      texto: `${r.nombre_autor} te dejó una reseña de ${r.estrellas} ${r.estrellas === 1 ? 'estrella' : 'estrellas'}`,
      fecha: r.created_at,
      leida: r.leida,
      link: '/tienda',
    })),
  ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

  // El stock bajo es una alerta vigente, no un evento: se muestra mientras dure y no cuenta como no leída
  const alertas = stockBajo.rows.map((p) => ({
    id: `stock-${p.pk_id}`,
    tipo: 'stock',
    texto: p.stock === 0 ? `Sin stock: ${p.nombre}` : `Stock bajo: ${p.nombre} (${p.stock} ${p.stock === 1 ? 'unidad' : 'unidades'})`,
    fecha: null,
    leida: false,
    link: '/inventario',
  }))

  return {
    noLeidas: eventos.filter((e) => !e.leida).length,
    notificaciones: [...alertas, ...eventos],
  }
}

const marcarNotificacionesLeidas = async (clienteId) => {
  const negocioResult = await repository.findBusinessByOwner(clienteId)
  if (negocioResult.rows.length === 0) {
    throw { status: 403, message: 'Esta cuenta no tiene un negocio para administrar' }
  }
  await repository.markNotificationsRead(negocioResult.rows[0].pk_id)
  return { message: 'Notificaciones marcadas como leídas' }
}

const getClientes = async (clienteId) => {
  const negocioResult = await repository.findBusinessByOwner(clienteId)
  if (negocioResult.rows.length === 0) {
    throw { status: 403, message: 'Esta cuenta no tiene un negocio para administrar' }
  }

  const negocio = negocioResult.rows[0]
  const result = await repository.getClients(negocio.pk_id)
  return {
    negocio: { id: negocio.pk_id, nombre: negocio.nombre, logoUrl: negocio.logo_url },
    clientes: result.rows.map((cliente) => ({
      ...cliente,
      total_gastado: Number(cliente.total_gastado),
      activo: new Date(cliente.ultima_compra) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    })),
  }
}

const getFinanzas = async (clienteId) => {
  const negocioResult = await repository.findBusinessByOwner(clienteId)
  if (negocioResult.rows.length === 0) throw { status: 403, message: 'Esta cuenta no tiene un negocio para administrar' }
  const negocio = negocioResult.rows[0]
  const [summaryResult, transactionsResult] = await Promise.all([
    repository.getFinanceSummary(negocio.pk_id),
    repository.getFinanceTransactions(negocio.pk_id),
  ])
  const summary = summaryResult.rows[0]
  return {
    negocio: { id: negocio.pk_id, nombre: negocio.nombre, logoUrl: negocio.logo_url },
    resumen: Object.fromEntries(Object.entries(summary).map(([key, value]) => [key, Number(value)])),
    gastosRegistrados: Number(summary.gastos_mes),
    transacciones: transactionsResult.rows.map((transaction) => ({
      ...transaction,
      monto_total: Number(transaction.monto_total),
      metodo: transaction.stripe_payment_intent ? 'Tarjeta' : 'Efectivo',
    })),
  }
}

const createExpense = async (clienteId, datos) => {
  const negocioResult = await repository.findBusinessByOwner(clienteId)
  if (negocioResult.rows.length === 0) throw { status: 403, message: 'Esta cuenta no tiene un negocio para administrar' }
  const { descripcion, categoria, monto, fecha } = datos
  if (!descripcion?.trim() || !categoria?.trim() || !Number.isFinite(Number(monto)) || Number(monto) <= 0) {
    throw { status: 400, message: 'Descripcion, categoria y un monto mayor a cero son obligatorios' }
  }
  const result = await repository.createExpense(negocioResult.rows[0].pk_id, {
    descripcion: descripcion.trim(), categoria: categoria.trim(), monto: Number(monto), fecha,
  })
  return { ...result.rows[0], monto: Number(result.rows[0].monto) }
}

const generateMarketing = async (clienteId, { tipo = 'Promoción / Oferta', prompt = '', tono = 'Modo Creativo', contentType = 'Publicación', generateImage = false }) => {
  const negocioResult = await repository.findBusinessByOwner(clienteId)
  if (negocioResult.rows.length === 0) {
    throw { status: 403, message: 'Esta cuenta no tiene un negocio para administrar' }
  }
  if (!prompt?.trim()) throw { status: 400, message: 'Describe el contenido que deseas generar' }

  const negocio = negocioResult.rows[0]
  const productosResult = await productoModel.findByNegocio(negocio.pk_id)
  const productos = productosResult.rows.slice(0, 8).map((p) => `${p.nombre} (S/${p.precio})`).join(', ')

  const isVideoFormat = contentType === 'Video' || contentType === 'Reels / Short'
  let completion
  let guionVideo = null
  let finalCaption = ''

  const toneGuides = {
    'Modo Creativo': 'Estilo creativo, fresco, divertido, con storytelling atractivo y emojis expresivos que cautiven al público en redes sociales.',
    'Modo Profesional': 'Estilo corporativo, elegante, enfocado en confianza, calidad superior, garantía y seriedad comercial.',
    'Formato Corto': 'Estilo ultraconciso, directo al grano (máximo 2 a 3 líneas de alto impacto), ideal para lecturas rápidas en Stories.',
    'Viral / Trending': 'Estilo persuasivo con psicología de urgencia (FOMO), llamado a la acción contundente, ganchos magnéticos y hashtags en tendencia.'
  }
  const toneInstruction = toneGuides[tono] || 'Estilo persuasivo y orientado a ventas.'

  if (isVideoFormat) {
    const systemInstruction = `Eres un estratega de contenido audiovisual y videos cortos (TikTok/Reels) para "${negocio.nombre}", negocio de ${negocio.categoria || 'comercio'} en Perú.
Tono solicitado: ${toneInstruction}.
Genera un guión estructurado, altamente específico y directamente relacionado a lo que pide el usuario (no inventes datos genéricos).
Estructura tu respuesta exactamente así:
GANCHO: [Frase de 0 a 3 segundos muy llamativa que detenga el scroll]
DESARROLLO: [Demostración rápida de 5 a 15 segundos destacando beneficios clave del producto]
CTA: [Llamada a la acción clara para comentar o comprar por WhatsApp/Link]
AUDIO: [Estilo de música o tendencia recomendada]
CAPTION: [Texto del post para publicar con emojis, llamada a la acción y hashtags relevantes]`

    try {
      completion = await groq.chat.completions.create({
        model: GROQ_MODEL,
        reasoning_effort: 'low',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: `Plantilla: ${tipo}. Tono: ${tono}. Productos del catálogo: ${productos || 'disponibles en tienda'}. Solicitud del usuario: "${prompt}". Escribe el guión y caption enfocados con precisión en esta solicitud.` }
        ],
        temperature: 0.7,
        max_tokens: 500
      })

      const rawText = completion.choices[0].message.content
      const ganchoMatch = rawText.match(/GANCHO:\s*(.+?)(?=\n[A-Z]+:|$)/s)
      const desarrolloMatch = rawText.match(/DESARROLLO:\s*(.+?)(?=\n[A-Z]+:|$)/s)
      const ctaMatch = rawText.match(/CTA:\s*(.+?)(?=\n[A-Z]+:|$)/s)
      const audioMatch = rawText.match(/AUDIO:\s*(.+?)(?=\n[A-Z]+:|$)/s)
      const captionMatch = rawText.match(/CAPTION:\s*(.+?)$/s)

      guionVideo = {
        gancho: ganchoMatch ? ganchoMatch[1].trim() : `🔥 ¡Atención amantes de ${negocio.categoria || 'buenos productos'}!`,
        desarrollo: desarrolloMatch ? desarrolloMatch[1].trim() : `Mira lo nuevo que llegó a ${negocio.nombre}: ${prompt}`,
        cta: ctaMatch ? ctaMatch[1].trim() : `📲 Escríbenos al WhatsApp para pedir el tuyo hoy mismo.`,
        audio_sugerido: audioMatch ? audioMatch[1].trim() : 'Trending Audio Upbeat - Lo-Fi Chill Beat'
      }
      finalCaption = captionMatch ? captionMatch[1].trim() : rawText
    } catch (err) {
      console.error('Error Groq Video:', err.message)
      guionVideo = {
        gancho: `🔥 ¡No dejes pasar esto en ${negocio.nombre}!`,
        desarrollo: `Llegó ${prompt}. Calidad comprobada y stock limitado.`,
        cta: `👉 Pide el tuyo al WhatsApp o mediante el link en bio.`,
        audio_sugerido: 'Viral TikTok Pop Beat'
      }
      finalCaption = `✨ ¡Lo que estabas esperando en ${negocio.nombre}! ✨\n\n${prompt}\n\n📲 Haz tu pedido ahora antes que se agote.\n#${negocio.categoria ? negocio.categoria.replace(/\s+/g, '') : 'tienda'} #peru #oferta #compras`
    }
  } else if (contentType === 'Story') {
    try {
      completion = await groq.chat.completions.create({
        model: GROQ_MODEL,
        reasoning_effort: 'low',
        messages: [
          { role: 'system', content: `Eres un copywriter experto para Instagram Stories y WhatsApp Status de "${negocio.nombre}" (${negocio.categoria || 'negocio'} en Perú). Tono: ${toneInstruction}. Genera un mensaje súper visual, directo al grano (máx 35 palabras), con emojis, precio/beneficio claro y llamado a tocar el sticker o responder al WhatsApp.` },
          { role: 'user', content: `Plantilla: ${tipo}. Tono: ${tono}. Idea: ${prompt}` }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
      finalCaption = completion.choices[0].message.content
    } catch (err) {
      console.error('Error Groq Story:', err.message)
      finalCaption = `⚡ ¡OFERTA FLASH en ${negocio.nombre}! ⚡\n${prompt}\n\n👇 ¡Toca el botón o respóndenos para asegurar el tuyo ahora!`
    }
  } else {
    try {
      completion = await groq.chat.completions.create({
        model: GROQ_MODEL,
        reasoning_effort: 'low',
        messages: [
          { role: 'system', content: `Eres el community manager y copywriter profesional de "${negocio.nombre}" (${negocio.categoria || 'tienda'} en Perú).
Tono solicitado: ${toneInstruction}.
Crea un post para Instagram/Facebook altamente persuasivo, impecablemente redactado y enfocado exactamente en lo que el dueño solicita.
Reglas:
1. Habla específicamente del producto o tema indicado por el dueño (sin textos genéricos).
2. Estructura con emojis atractivos en puntos clave (beneficios, características, llamada a la acción).
3. Añade una llamada a la acción clara para pedir por WhatsApp o catálogo online.
4. Finaliza con 5 a 8 hashtags virales relevantes al rubro y a Perú.` },
          { role: 'user', content: `Plantilla: ${tipo}. Tono: ${tono}. Lo que quiero promocionar: "${prompt}". Productos del catálogo: ${productos || 'disponibles en tienda'}.` }
        ],
        max_tokens: 450,
        temperature: 0.7
      })
      finalCaption = completion.choices[0].message.content
    } catch (err) {
      console.error('Error Groq Feed:', err.message)
      finalCaption = `✨ ¡Descubre lo nuevo en ${negocio.nombre}! ✨\n\n${prompt}\n\n🛍️ Calidad garantizada y entregas inmediatas.\n📲 Escríbenos por WhatsApp o DM para hacer tu pedido.\n\n#${negocio.nombre.replace(/\s+/g, '')} #peru #emprendimiento #calidad #compras`
    }
  }

  finalCaption = limpiarMarkdown(finalCaption)
  if (guionVideo) {
    guionVideo = Object.fromEntries(Object.entries(guionVideo).map(([clave, valor]) => [clave, limpiarMarkdown(valor)]))
  }

  let mediaUrl = null
  if (generateImage) {
    const mediaGen = await generateProductImage(clienteId, { prompt, categoria: negocio.categoria, mode: 'studio' }).catch(() => ({}))
    mediaUrl = mediaGen.imageUrl || null
  }

  return {
    negocio: { id: negocio.pk_id, nombre: negocio.nombre },
    contenido: finalCaption,
    guionVideo,
    mediaUrl,
    contentType
  }
}


// El generador de imágenes entiende mejor una descripción corta en inglés que la instrucción
// completa del dueño (con precios, WhatsApp, etc.), así que la IA de texto la redacta primero
const crearPromptImagen = async (idea, categoria) => {
  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      reasoning_effort: 'low',
      messages: [
        {
          role: 'system',
          content: 'You write prompts for an AI image generator. Reply with ONE English sentence (max 35 words) describing a realistic, well-lit commercial photo of the main product or subject of the idea. Describe only what should be seen: the product, its colors, setting and style. Never include prices, phone numbers, written text, logos or watermarks.'
        },
        { role: 'user', content: `Type of business: ${categoria || 'local store'}. Idea: ${idea}` }
      ],
      max_tokens: 400,
      temperature: 0.4
    })
    const texto = completion.choices[0].message.content.trim().replace(/^["']|["']$/g, '')
    if (texto) return texto
  } catch (err) {
    console.error('No se pudo redactar el prompt de imagen:', err.message)
  }
  return `${idea}, ${categoria || ''} product, commercial photography`
}

const generateProductImage = async (clienteId, { mode, prompt, nombre, categoria }) => {
  const idea = (prompt || nombre || '').trim()
  if (!idea) throw { status: 400, message: 'Escribe qué producto o idea quieres en la imagen' }

  const descripcion = await crearPromptImagen(idea, categoria)
  const enhancedPrompt = `${descripcion}, professional product photography, high detail, no text, no watermark`
  const seed = Math.floor(Math.random() * 1000000)
  const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=1024&height=1024&model=flux&seed=${seed}&nologo=true`

  // Sin clave, Pollinations permite 1 imagen cada ~45 s por servidor y pone marca de agua.
  // Con POLLINATIONS_KEY (enter.pollinations.ai) no hay ese límite.
  const headers = process.env.POLLINATIONS_KEY ? { Authorization: `Bearer ${process.env.POLLINATIONS_KEY}` } : {}
  let esperaSugerida = 0

  for (let intento = 1; intento <= 2; intento++) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 60000)
      const response = await fetch(pollUrl, { headers, signal: controller.signal })
      clearTimeout(timeout)

      const contentType = response.headers.get('content-type') || ''
      if (response.ok && contentType.startsWith('image/')) {
        const buffer = await response.arrayBuffer()
        const base64 = Buffer.from(buffer).toString('base64')
        return { imageUrl: `data:${contentType};base64,${base64}`, prompt: idea, descripcion, mode: mode || 'prompt', provider: 'pollinations_ai' }
      }

      // Límite del plan gratuito: el servicio dice cuántos segundos esperar ("Retry after 20s")
      const detalle = await response.json().catch(() => ({}))
      const segundos = Number(/retry after (\d+)\s*s/i.exec(detalle?.error?.message || '')?.[1])
      esperaSugerida = Number.isFinite(segundos) ? segundos : 0
      console.error(`Pollinations respondió sin imagen (intento ${intento}):`, response.status, detalle?.error?.code || '')
      if (![402, 429, 503].includes(response.status) || esperaSugerida > 50) break
    } catch (err) {
      console.error(`Pollinations no respondió (intento ${intento}):`, err.message)
    }
    if (intento < 2) await new Promise((r) => setTimeout(r, ((esperaSugerida || 5) + 1) * 1000))
  }

  if (esperaSugerida > 0) {
    throw { status: 429, message: `El generador gratuito permite una imagen cada 45 segundos. Espera unos ${esperaSugerida} segundos y vuelve a intentarlo.` }
  }

  // Sin imagen de relleno: una foto al azar podría no tener nada que ver con el negocio
  throw { status: 502, message: 'El generador de imágenes no respondió. Inténtalo de nuevo en unos segundos o sube tu propia foto.' }
}

const getMarketingPosts = async (clienteId, estado) => {
  const negocioResult = await repository.findBusinessByOwner(clienteId)
  if (negocioResult.rows.length === 0) throw { status: 403, message: 'Negocio no encontrado' }
  const result = await repository.getMarketingPosts(negocioResult.rows[0].pk_id, estado)
  return result.rows
}

const PLATAFORMAS_META = ['facebook', 'instagram']

// Facebook e Instagram no interpretan Markdown: "**oferta**" se vería con asteriscos
const limpiarMarkdown = (texto = '') =>
  texto
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/(^|\s)\*(\S.*?\S|\S)\*(?=\s|$|[.,!?])/g, '$1$2')
    .replace(/^#{1,6}\s+/gm, '')
    .trim()

const normalizarPlataformas = (plataformas) =>
  [...new Set((plataformas || []).map((p) => String(p).toLowerCase()).filter((p) => PLATAFORMAS_META.includes(p)))]

// Publica en las redes indicadas usando las cuentas conectadas del negocio.
// Devuelve qué salió bien y qué falló en cada red (no lanza error si una red falla).
const publicarEnRedes = async (negocioId, { caption, mediaUrl, contentType, plataformas }) => {
  const tokens = (await repository.getSocialTokens(negocioId, plataformas)).rows
  const errores = plataformas
    .filter((p) => !tokens.some((t) => t.plataforma === p))
    .map((p) => ({ plataforma: p, error: 'Esta red no está conectada con Meta' }))
  if (tokens.length === 0) return { resultados: [], errores }

  const publicado = await socialPublisher.publishToNetworks({
    caption,
    mediaUrl,
    contentType: contentType || 'Publicación',
    cuentas: tokens.map((t) => ({ plataforma: t.plataforma, cuentaId: t.cuenta_id_externa, accessToken: t.access_token })),
  })
  return { resultados: publicado.resultados, errores: [...publicado.errores, ...errores] }
}

// Fecha programada: ISO con zona horaria desde el navegador, o "AAAA-MM-DD HH:MM" en hora de Perú
const leerFechaProgramada = (postData) => {
  const valor = postData.fechaProgramada ||
    (postData.scheduleDate ? `${postData.scheduleDate}T${postData.scheduleTime || '12:00'}:00-05:00` : null)
  const fecha = valor ? new Date(valor) : null
  if (!fecha || Number.isNaN(fecha.getTime())) throw { status: 400, message: 'Elige la fecha y la hora de publicación' }
  if (fecha.getTime() < Date.now() + 60 * 1000) throw { status: 400, message: 'La fecha programada debe ser en el futuro' }
  return fecha
}

const saveMarketingPost = async (clienteId, postData) => {
  const negocioResult = await repository.findBusinessByOwner(clienteId)
  if (negocioResult.rows.length === 0) throw { status: 403, message: 'Negocio no encontrado' }
  const negocioId = negocioResult.rows[0].pk_id

  const programar = postData.estado === 'programado' || postData.publishMode === 'programar'
  const plataformas = normalizarPlataformas(postData.platforms || postData.plataformas)
  let fechaProgramada = null
  if (programar) {
    fechaProgramada = leerFechaProgramada(postData)
    if (plataformas.length === 0) throw { status: 400, message: 'Elige al menos una red: Facebook o Instagram' }
    const conectadas = (await repository.getSocialTokens(negocioId, plataformas)).rows
    if (conectadas.length === 0)
      throw { status: 400, message: 'Conecta tu Página de Facebook (y su Instagram) antes de programar' }
    if (plataformas.includes('instagram') && !(postData.image || postData.mediaUrl))
      throw { status: 400, message: 'Instagram exige una imagen: agrega una foto antes de programar' }
  }

  // Se guarda la imagen en Storage para no llenar la base de datos con base64
  const mediaUrl = await asegurarUrlPublica(postData.image || postData.mediaUrl, `marketing/${negocioId}`)

  const result = await repository.createMarketingPost(negocioId, {
    tipoContenido: postData.contentType || postData.tipoContenido || 'Publicación',
    plantilla: postData.tipo || postData.plantilla,
    tono: postData.tono,
    promptUsado: postData.prompt,
    caption: limpiarMarkdown(postData.caption || postData.text || postData.contenido || ''),
    guionVideo: postData.guionVideo,
    mediaUrl,
    plataformas,
    estado: programar ? 'programado' : 'borrador',
    fechaProgramada
  })
  return result.rows[0]
}

const publishDirectlyMarketing = async (clienteId, postData) => {
  const negocioResult = await repository.findBusinessByOwner(clienteId)
  if (negocioResult.rows.length === 0) throw { status: 403, message: 'Negocio no encontrado' }
  const negocioId = negocioResult.rows[0].pk_id

  const caption = limpiarMarkdown(postData.caption || postData.text || postData.content || '')
  if (!caption) throw { status: 400, message: 'Escribe o genera el texto de la publicación' }

  const plataformas = normalizarPlataformas(postData.platforms || postData.plataformas)
  if (plataformas.length === 0)
    throw { status: 400, message: 'Elige al menos una red: Facebook o Instagram' }

  // Solo se publica en cuentas conectadas de verdad con Meta (con token)
  const conectadas = (await repository.getSocialTokens(negocioId, plataformas)).rows
  if (conectadas.length === 0)
    throw { status: 400, message: 'Conecta tu Página de Facebook (y su Instagram) con el botón "Conectar con Meta" antes de publicar' }

  const mediaUrl = await asegurarUrlPublica(postData.image || postData.uploadedImage || postData.mediaUrl, `marketing/${negocioId}`)
  const { resultados, errores } = await publicarEnRedes(negocioId, {
    caption, mediaUrl, contentType: postData.contentType, plataformas,
  })

  // Si no se publicó en ninguna red, se informa el error y no se guarda como publicada
  if (resultados.length === 0) {
    throw { status: 502, message: `No se pudo publicar. ${errores.map((e) => `${e.plataforma}: ${e.error}`).join(' · ')}` }
  }

  const post = await repository.createMarketingPost(negocioId, {
    tipoContenido: postData.contentType || 'Publicación',
    plantilla: postData.tipo || 'Promoción',
    tono: postData.tono || 'Modo Creativo',
    promptUsado: postData.prompt || '',
    caption,
    guionVideo: postData.guionVideo,
    mediaUrl,
    plataformas: resultados.map((r) => r.plataforma),
    estado: 'publicado',
    fechaProgramada: null
  })
  const actualizado = await repository.updateMarketingPostStatus(negocioId, post.rows[0].pk_id, 'publicado', { resultados, errores })

  return { ...actualizado.rows[0], resultados, errores }
}

const deleteMarketingPost = async (clienteId, postId) => {
  const negocioResult = await repository.findBusinessByOwner(clienteId)
  if (negocioResult.rows.length === 0) throw { status: 403, message: 'Negocio no encontrado' }
  const result = await repository.deleteMarketingPost(negocioResult.rows[0].pk_id, postId)
  if (result.rows.length === 0) throw { status: 404, message: 'Solo se pueden cancelar publicaciones programadas o fallidas' }
  return { message: 'Publicación cancelada' }
}

// La llama la tarea automática cada minuto: publica las programadas cuya hora ya llegó
const publicarProgramadasPendientes = async () => {
  await repository.failStuckPublishingPosts()
  const pendientes = (await repository.claimDueScheduledPosts()).rows
  const resumen = { publicadas: 0, fallidas: 0 }

  for (const post of pendientes) {
    let resultado
    try {
      resultado = await publicarEnRedes(post.fk_negocio_id, {
        caption: post.caption,
        mediaUrl: post.media_url || null,
        contentType: post.tipo_contenido,
        plataformas: normalizarPlataformas(post.plataformas),
      })
    } catch (err) {
      resultado = { resultados: [], errores: [{ plataforma: 'general', error: err.message || 'Error al publicar' }] }
    }
    const estado = resultado.resultados.length > 0 ? 'publicado' : 'fallido'
    await repository.updateMarketingPostStatus(post.fk_negocio_id, post.pk_id, estado, resultado)
    resumen[estado === 'publicado' ? 'publicadas' : 'fallidas'] += 1
  }
  return resumen
}

const getSocialAccounts = async (clienteId) => {
  const negocioResult = await repository.findBusinessByOwner(clienteId)
  if (negocioResult.rows.length === 0) throw { status: 403, message: 'Negocio no encontrado' }
  const result = await repository.getSocialAccounts(negocioResult.rows[0].pk_id)
  return result.rows
}

const connectSocialAccount = async (clienteId, accountData) => {
  const negocioResult = await repository.findBusinessByOwner(clienteId)
  if (negocioResult.rows.length === 0) throw { status: 403, message: 'Negocio no encontrado' }
  const result = await repository.upsertSocialAccount(negocioResult.rows[0].pk_id, accountData)
  return result.rows[0]
}

const disconnectSocialAccount = async (clienteId, cuentaId) => {
  const negocioResult = await repository.findBusinessByOwner(clienteId)
  if (negocioResult.rows.length === 0) throw { status: 403, message: 'Negocio no encontrado' }
  const result = await repository.deleteSocialAccount(negocioResult.rows[0].pk_id, cuentaId)
  if (result.rows.length === 0) throw { status: 404, message: 'Cuenta no encontrada' }
  return { message: 'Cuenta desconectada' }
}

const getMetaAuthUrl = (redirectUri) => {
  return socialPublisher.getMetaAuthUrl(redirectUri)
}

// Si el usuario administra varias Páginas, se usa la que tiene Instagram vinculado (o la primera)
const guardarCuentasMeta = async (negocioId, accounts) => {
  const igCuenta = accounts.find((a) => a.plataforma === 'instagram')
  const paginas = accounts.filter((a) => a.plataforma === 'facebook')
  const pagina = (igCuenta && paginas.find((p) => p.accessToken === igCuenta.accessToken)) || paginas[0]

  const savedAccounts = []
  for (const acc of [pagina, igCuenta].filter(Boolean)) {
    const res = await repository.upsertSocialAccount(negocioId, acc)
    savedAccounts.push(res.rows[0])
  }
  return savedAccounts
}

const handleMetaOAuthCallback = async (clienteId, { code, redirectUri }) => {
  const negocioResult = await repository.findBusinessByOwner(clienteId)
  if (negocioResult.rows.length === 0) throw { status: 403, message: 'Negocio no encontrado' }

  // 1. Canjear código por Token de larga duración
  const token = await socialPublisher.exchangeMetaCode({ code, redirectUri })

  // 2. Obtener páginas y cuentas vinculadas, y guardarlas
  const accounts = await socialPublisher.fetchMetaAccounts(token)
  const savedAccounts = await guardarCuentasMeta(negocioResult.rows[0].pk_id, accounts)

  return {
    success: true,
    message: 'Cuentas de Meta vinculadas exitosamente',
    accounts: savedAccounts
  }
}

const connectMetaManualToken = async (clienteId, { accessToken }) => {
  const negocioResult = await repository.findBusinessByOwner(clienteId)
  if (negocioResult.rows.length === 0) throw { status: 403, message: 'Negocio no encontrado' }

  if (!accessToken?.trim()) throw { status: 400, message: 'Pega el token de Meta' }
  const tokenLargo = await socialPublisher.extendUserToken(accessToken.trim())
  const accounts = await socialPublisher.fetchMetaAccounts(tokenLargo).catch((err) => {
    throw { status: 400, message: `Meta rechazó el token: ${err.message}` }
  })
  const savedAccounts = await guardarCuentasMeta(negocioResult.rows[0].pk_id, accounts)

  return {
    success: true,
    message: 'Cuentas de Meta vinculadas mediante token',
    accounts: savedAccounts
  }
}

module.exports = {
  getResumen,
  getInventario,
  getTienda,
  updateTienda,
  createProduct,
  updateProduct,
  deleteProduct,
  getVentas,
  createSale,
  updateOrderStatus,
  getNotificaciones,
  marcarNotificacionesLeidas,
  getClientes,
  getFinanzas,
  createExpense,
  generateMarketing,
  generateProductImage,
  getMarketingPosts,
  saveMarketingPost,
  publishDirectlyMarketing,
  getSocialAccounts,
  connectSocialAccount,
  disconnectSocialAccount,
  deleteMarketingPost,
  publicarProgramadasPendientes,
  getMetaAuthUrl,
  handleMetaOAuthCallback,
  connectMetaManualToken,
}



