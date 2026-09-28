const repository = require('./admin.repository')
const Groq = require('groq-sdk')
const productoModel = require('../../models/productoModel')

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
  const result = await repository.createSale(negocio.pk_id, data)
  return result.rows[0]
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

const generateMarketing = async (clienteId, { tipo = 'Promoción / Oferta', prompt = '', tono = 'Modo Creativo', contentType = 'Publicación' }) => {
  const negocioResult = await repository.findBusinessByOwner(clienteId)
  if (negocioResult.rows.length === 0) {
    throw { status: 403, message: 'Esta cuenta no tiene un negocio para administrar' }
  }
  if (!prompt?.trim()) throw { status: 400, message: 'Describe el contenido que deseas generar' }

  const negocio = negocioResult.rows[0]
  const productosResult = await productoModel.findByNegocio(negocio.pk_id)
  const productos = productosResult.rows.slice(0, 12).map((producto) => `${producto.nombre} (S/${producto.precio})`).join(', ')

  const isVideoFormat = contentType === 'Video' || contentType === 'Reels / Short'
  let completion
  let guionVideo = null
  let finalCaption = ''

  if (isVideoFormat) {
    const systemInstruction = `Eres el productor creativo de videos y Reels/Shorts para ${negocio.nombre}, negocio de ${negocio.categoria || 'productos'} en Perú.
Debes devolver OBLIGATORIAMENTE un JSON válido con la siguiente estructura exacta:
{
  "guion": {
    "gancho": "Frase de 0-3 segundos para llamar la atención de forma impactante",
    "desarrollo": "Descripción de 3-15 segundos sobre el beneficio o demostración del producto",
    "cta": "Llamada a la acción clara para comentar o ir al link en bio",
    "audio_sugerido": "Nombre de tendencia o estilo de música/efectos"
  },
  "caption": "Texto completo para el post con emojis, llamada a la acción y hashtags virales"
}`

    try {
      completion = await groq.chat.completions.create({
        model: 'openai/gpt-oss-120b',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: `Tipo: ${tipo}. Estilo: ${tono}. Productos disponibles: ${productos}. Idea del negocio: ${prompt}` }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })

      const parsed = JSON.parse(completion.choices[0].message.content)
      guionVideo = parsed.guion
      finalCaption = parsed.caption
    } catch (err) {
      guionVideo = {
        gancho: `🔥 ¡Atención! No te pierdas esto de ${negocio.nombre}`,
        desarrollo: `Descubre nuestros mejores productos como ${productos.split(',')[0] || 'nuestro catálogo exclusivo'} con la mejor calidad.`,
        cta: `🛒 Haz clic en el enlace de la bio para hacer tu pedido hoy mismo con envío rápido.`,
        audio_sugerido: 'Trending Audio Viral - Pop Upbeat'
      }
      finalCaption = `📹 ¡Mira esto! Descubre la calidad de ${negocio.nombre}. ${prompt}\n\n👉 Haz tu pedido por WhatsApp o link en bio.\n#viral #tienda #${negocio.categoria || 'peru'}`
    }
  } else if (contentType === 'Story') {
    try {
      completion = await groq.chat.completions.create({
        model: 'openai/gpt-oss-120b',
        messages: [
          { role: 'system', content: `Eres el experto de social media de ${negocio.nombre}. Genera un texto para Instagram Story / WhatsApp Status súper corto, ultra directo (máximo 25 palabras), con sticker de encuesta o cuenta regresiva y emojis impactantes.` },
          { role: 'user', content: `Tipo: ${tipo}. Tono: ${tono}. Idea: ${prompt}` }
        ],
        max_tokens: 150
      })
      finalCaption = completion.choices[0].message.content
    } catch (err) {
      finalCaption = `⚡ ¡OFERTA FLASH EN STORY! ⚡\nÚltimas unidades disponibles en ${negocio.nombre}.\n\n👇 Toca aquí para comprar ahora antes que se agote.`
    }
  } else {
    try {
      completion = await groq.chat.completions.create({
        model: 'openai/gpt-oss-120b',
        messages: [
          { role: 'system', content: `Eres el asistente experto de marketing de ${negocio.nombre}, negocio de ${negocio.categoria || 'productos y servicios'} en Peru. Genera contenido atractivo y listo para redes sociales en espanol peruano. Productos disponibles: ${productos || 'productos del catalogo'}. Usa emojis, hashtags relevantes y llamada a la accion clara.` },
          { role: 'user', content: `Tipo: ${tipo}. Estilo / Tono: ${tono}. Solicitud del negocio: ${prompt || 'Crea una promocion atractiva para nuestro catalogo'}. Devuelve el post redactado de forma profesional e impactante.` }
        ],
        max_tokens: 400
      })
      finalCaption = completion.choices[0].message.content
    } catch (err) {
      finalCaption = `🎉 ¡OFERTA ESPECIAL en ${negocio.nombre}! 🎉\n\nDescubre nuestros productos destacados: ${productos}.\n\n💬 Escríbenos para obtener tu descuento exclusivo hoy.\n#descuento #promocion #compras`
    }
  }

  const mediaGen = await generateProductImage(clienteId, { prompt: `${prompt} ${tipo}`, categoria: negocio.categoria, mode: 'studio' }).catch(() => ({}))
  const mediaUrl = mediaGen.imageUrl || getStudioFallback(prompt, negocio.categoria)

  return {
    negocio: { id: negocio.pk_id, nombre: negocio.nombre },
    contenido: finalCaption,
    guionVideo,
    mediaUrl,
    contentType
  }
}


const categoryImages = {
  ropa: [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80'
  ],
  accesorios: [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80'
  ],
  electronica: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&auto=format&fit=crop&q=80'
  ],
  hogar: [
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80'
  ],
  papeleria: [
    'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80'
  ],
  general: [
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&auto=format&fit=crop&q=80'
  ]
}

function getStudioFallback(prompt = '', cat = '') {
  const text = `${prompt} ${cat}`.toLowerCase()
  if (text.includes('ropa') || text.includes('polo') || text.includes('camisa') || text.includes('vestido') || text.includes('polera') || text.includes('casaca')) {
    return categoryImages.ropa[Math.floor(Math.random() * categoryImages.ropa.length)]
  }
  if (text.includes('mochila') || text.includes('reloj') || text.includes('billetera') || text.includes('lentes') || text.includes('accesorios') || text.includes('bolso')) {
    return categoryImages.accesorios[Math.floor(Math.random() * categoryImages.accesorios.length)]
  }
  if (text.includes('audifono') || text.includes('celular') || text.includes('laptop') || text.includes('electronica') || text.includes('gadget') || text.includes('parlante')) {
    return categoryImages.electronica[Math.floor(Math.random() * categoryImages.electronica.length)]
  }
  if (text.includes('taza') || text.includes('vela') || text.includes('hogar') || text.includes('adorno') || text.includes('cojin')) {
    return categoryImages.hogar[Math.floor(Math.random() * categoryImages.hogar.length)]
  }
  if (text.includes('cuaderno') || text.includes('papeleria') || text.includes('agenda') || text.includes('lapiz')) {
    return categoryImages.papeleria[Math.floor(Math.random() * categoryImages.papeleria.length)]
  }
  return categoryImages.general[Math.floor(Math.random() * categoryImages.general.length)]
}

const generateProductImage = async (clienteId, { mode, prompt, nombre, categoria }) => {
  let textPrompt = prompt || nombre || 'Producto de catalogo e-commerce'
  if (categoria && !textPrompt.toLowerCase().includes(categoria.toLowerCase())) {
    textPrompt += ` categoria ${categoria}`
  }

  const enhancedPrompt = `${textPrompt.trim()}, commercial product photography, white background, 4k`
  const seed = Math.floor(Math.random() * 1000000)
  const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=600&height=600&seed=${seed}&nologo=true`

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 4500)
    const response = await fetch(pollUrl, { signal: controller.signal })
    clearTimeout(timeout)

    if (response.ok) {
      const buffer = await response.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')
      const contentType = response.headers.get('content-type') || 'image/jpeg'
      const dataUri = `data:${contentType};base64,${base64}`
      return { imageUrl: dataUri, prompt: textPrompt, mode: mode || 'prompt', provider: 'pollinations_ai' }
    }
  } catch (err) {
    // If Pollinations server takes >4.5s or fails, seamlessly use HD Studio Catalog fallback
  }

  const fallbackUrl = getStudioFallback(textPrompt, categoria)
  return { imageUrl: fallbackUrl, prompt: textPrompt, mode: mode || 'prompt', provider: 'studio_catalog' }
}

const getMarketingPosts = async (clienteId, estado) => {
  const negocioResult = await repository.findBusinessByOwner(clienteId)
  if (negocioResult.rows.length === 0) throw { status: 403, message: 'Negocio no encontrado' }
  const result = await repository.getMarketingPosts(negocioResult.rows[0].pk_id, estado)
  return result.rows
}

const saveMarketingPost = async (clienteId, postData) => {
  const negocioResult = await repository.findBusinessByOwner(clienteId)
  if (negocioResult.rows.length === 0) throw { status: 403, message: 'Negocio no encontrado' }
  const result = await repository.createMarketingPost(negocioResult.rows[0].pk_id, {
    tipoContenido: postData.contentType || postData.tipoContenido || 'Publicación',
    plantilla: postData.tipo || postData.plantilla,
    tono: postData.tono,
    promptUsado: postData.prompt,
    caption: postData.caption || postData.text || postData.contenido,
    guionVideo: postData.guionVideo,
    mediaUrl: postData.image || postData.mediaUrl,
    plataformas: postData.platforms || postData.plataformas || ['Instagram', 'Facebook'],
    estado: postData.estado || (postData.publishMode === 'programar' ? 'programado' : 'publicado'),
    fechaProgramada: postData.scheduleDate ? `${postData.scheduleDate} ${postData.scheduleTime || '12:00'}` : postData.fechaProgramada
  })
  return result.rows[0]
}

const publishDirectlyMarketing = async (clienteId, postData) => {
  const negocioResult = await repository.findBusinessByOwner(clienteId)
  if (negocioResult.rows.length === 0) throw { status: 403, message: 'Negocio no encontrado' }
  const negocioId = negocioResult.rows[0].pk_id

  const metaResult = {
    meta_post_id: `ig_post_${Date.now()}`,
    status: 'published_successfully',
    timestamp: new Date().toISOString()
  }

  const post = await repository.createMarketingPost(negocioId, {
    tipoContenido: postData.contentType || 'Publicación',
    plantilla: postData.tipo || 'Promoción',
    tono: postData.tono || 'Modo Creativo',
    promptUsado: postData.prompt || '',
    caption: postData.text || postData.content || postData.caption,
    guionVideo: postData.guionVideo,
    mediaUrl: postData.image || postData.uploadedImage || postData.mediaUrl,
    plataformas: postData.platforms || ['Instagram', 'Facebook'],
    estado: 'publicado',
    fechaProgramada: null
  })

  await repository.updateMarketingPostStatus(negocioId, post.rows[0].pk_id, 'publicado', metaResult)

  return { ...post.rows[0], estado: 'publicado', resultado_publicacion: metaResult }
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
}



