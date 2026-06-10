const cuentaService = require('../services/cuentaService')

const getFavoritos = async (req, res, next) => {
  try { res.json(await cuentaService.getFavoritos(req.user.id)) }
  catch (err) { next(err) }
}

const toggleFavorito = async (req, res, next) => {
  try { res.json(await cuentaService.toggleFavorito(req.user.id, req.body.producto_id)) }
  catch (err) { next(err) }
}

const getVistos = async (req, res, next) => {
  try { res.json(await cuentaService.getVistos(req.user.id)) }
  catch (err) { next(err) }
}

const registrarVisto = async (req, res, next) => {
  try { res.json(await cuentaService.registrarVisto(req.user.id, req.body.producto_id)) }
  catch (err) { next(err) }
}

const getOfertas = async (req, res, next) => {
  try { res.json(await cuentaService.getOfertas()) }
  catch (err) { next(err) }
}

const getParaTi = async (req, res, next) => {
  try { res.json(await cuentaService.getParaTi(req.user.id)) }
  catch (err) { next(err) }
}

const getParaTiEconomico = async (req, res, next) => {
  try { res.json(await cuentaService.getParaTiEconomico(req.user.id)) }
  catch (err) { next(err) }
}

const getCarrito = async (req, res, next) => {
  try { res.json(await cuentaService.getCarrito(req.user.id)) }
  catch (err) { next(err) }
}

const agregarAlCarrito = async (req, res, next) => {
  try {
    const { producto_id, negocio_id, cantidad } = req.body
    res.json(await cuentaService.agregarAlCarrito(req.user.id, producto_id, negocio_id, cantidad))
  } catch (err) { next(err) }
}

const actualizarCarrito = async (req, res, next) => {
  try {
    const { producto_id, cantidad } = req.body
    res.json(await cuentaService.actualizarCarrito(req.user.id, producto_id, cantidad))
  } catch (err) { next(err) }
}

const limpiarCarrito = async (req, res, next) => {
  try { res.json(await cuentaService.limpiarCarrito(req.user.id)) }
  catch (err) { next(err) }
}

const buscar = async (req, res, next) => {
  try { res.json(await cuentaService.buscar(req.query.q)) }
  catch (err) { next(err) }
}

module.exports = {
  getFavoritos, toggleFavorito,
  getVistos, registrarVisto,
  getOfertas, getParaTi, getParaTiEconomico,
  getCarrito, agregarAlCarrito, actualizarCarrito, limpiarCarrito,
  buscar,
}
