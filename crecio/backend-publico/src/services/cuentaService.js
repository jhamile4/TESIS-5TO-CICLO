const cuentaModel   = require('../models/cuentaModel')
const pedidoModel   = require('../models/pedidoModel')
const { VISTOS_LIMITE, PARA_TI_LIMITE, BUSCAR_PRODUCTOS_LIM, BUSCAR_NEGOCIOS_LIM } = require('../config/constants')

const getFavoritos = async (clienteId) => {
  const result = await cuentaModel.getFavoritos(clienteId)
  return result.rows
}

const toggleFavorito = async (clienteId, productoId) => {
  const existe = await cuentaModel.findFavorito(clienteId, productoId)
  if (existe.rows.length > 0) {
    await cuentaModel.removeFavorito(clienteId, productoId)
    return { favorito: false }
  }
  await cuentaModel.addFavorito(clienteId, productoId)
  return { favorito: true }
}

const getVistos = async (clienteId) => {
  const result = await cuentaModel.getVistos(clienteId, VISTOS_LIMITE)
  return result.rows
}

const registrarVisto = async (clienteId, productoId) => {
  await cuentaModel.upsertVisto(clienteId, productoId)
  return { message: 'Registrado' }
}

const getOfertas = async () => {
  const result = await cuentaModel.getOfertas()
  return result.rows
}

const getParaTi = async (clienteId) => {
  const catResult  = await pedidoModel.findCategoriasCompradas(clienteId)
  const categorias = catResult.rows.map(r => r.categoria)

  const result = categorias.length > 0
    ? await cuentaModel.getParaTiPorCategorias(categorias, PARA_TI_LIMITE)
    : await cuentaModel.getParaTiRandom(PARA_TI_LIMITE)

  return result.rows
}

const getParaTiEconomico = async (clienteId) => {
  const catResult  = await pedidoModel.findCategoriasCompradas(clienteId)
  const categorias = catResult.rows.map(r => r.categoria)

  const result = categorias.length > 0
    ? await cuentaModel.getEconomicoPorCategorias(categorias, PARA_TI_LIMITE)
    : await cuentaModel.getEconomicoRandom(PARA_TI_LIMITE)

  return result.rows
}

const getCarrito = async (clienteId) => {
  const result = await cuentaModel.getCarrito(clienteId)
  return result.rows
}

const agregarAlCarrito = async (clienteId, productoId, negocioId, cantidad = 1) => {
  await cuentaModel.upsertCarrito(clienteId, productoId, negocioId, cantidad)
  return { message: 'Agregado' }
}

const actualizarCarrito = async (clienteId, productoId, cantidad) => {
  if (cantidad <= 0) {
    await cuentaModel.removeCarritoItem(clienteId, productoId)
  } else {
    await cuentaModel.updateCarritoCantidad(clienteId, productoId, cantidad)
  }
  return { message: 'Actualizado' }
}

const limpiarCarrito = async (clienteId) => {
  await cuentaModel.clearCarrito(clienteId)
  return { message: 'Limpiado' }
}

const buscar = async (q) => {
  if (!q || q.trim().length < 2) return { productos: [], negocios: [] }
  const term = `%${q.trim()}%`

  const [productosResult, negociosResult] = await Promise.all([
    cuentaModel.buscarProductos(term, BUSCAR_PRODUCTOS_LIM),
    cuentaModel.buscarNegocios(term, BUSCAR_NEGOCIOS_LIM),
  ])

  return { productos: productosResult.rows, negocios: negociosResult.rows }
}

module.exports = {
  getFavoritos, toggleFavorito,
  getVistos, registrarVisto,
  getOfertas, getParaTi, getParaTiEconomico,
  getCarrito, agregarAlCarrito, actualizarCarrito, limpiarCarrito,
  buscar,
}
