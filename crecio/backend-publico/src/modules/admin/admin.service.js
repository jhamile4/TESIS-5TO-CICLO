const repository = require('./admin.repository')

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

  const negocioId = negocioResult.rows[0].pk_id
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

module.exports = { getResumen, getInventario }
