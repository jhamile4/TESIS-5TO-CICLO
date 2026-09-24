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
    gastosRegistrados: 0,
    transacciones: transactionsResult.rows.map((transaction) => ({
      ...transaction,
      monto_total: Number(transaction.monto_total),
      metodo: transaction.stripe_payment_intent ? 'Tarjeta' : 'Efectivo',
    })),
  }
}

const generateMarketing = async (clienteId, { tipo = 'Promoción / Oferta', prompt = '', tono = 'Modo Creativo' }) => {
  const negocioResult = await repository.findBusinessByOwner(clienteId)
  if (negocioResult.rows.length === 0) {
    throw { status: 403, message: 'Esta cuenta no tiene un negocio para administrar' }
  }
  if (!prompt?.trim()) throw { status: 400, message: 'Describe el contenido que deseas generar' }

  const negocio = negocioResult.rows[0]
  const productosResult = await productoModel.findByNegocio(negocio.pk_id)
  const productos = productosResult.rows.slice(0, 12).map((producto) => `${producto.nombre} (S/${producto.precio})`).join(', ')
  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      { role: 'system', content: `Eres el asistente de marketing de ${negocio.nombre}, negocio de ${negocio.categoria || 'productos y servicios'} en Peru. Genera contenido listo para redes sociales en espanol. Usa solo este contexto: productos disponibles: ${productos || 'no hay productos cargados'}. No inventes descuentos, precios ni datos que no aparezcan en el pedido.` },
      { role: 'user', content: `Tipo: ${tipo}. Estilo: ${tono}. Solicitud: ${prompt}. Devuelve un texto atractivo de maximo 500 caracteres, con llamada a la accion y hashtags relevantes.` },
    ],
    max_tokens: 260,
    temperature: 0.7,
  })
  return { negocio: { id: negocio.pk_id, nombre: negocio.nombre }, contenido: completion.choices[0].message.content }
}

module.exports = { getResumen, getInventario, createProduct, getVentas, getClientes, getFinanzas, generateMarketing }
