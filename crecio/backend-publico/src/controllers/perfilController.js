const perfilService = require('../services/perfilService')

const getPerfil = async (req, res, next) => {
  try { res.json(await perfilService.getPerfil(req.user.id)) }
  catch (err) { next(err) }
}

const getMisPedidos = async (req, res, next) => {
  try { res.json(await perfilService.getMisPedidos(req.user.id)) }
  catch (err) { next(err) }
}

const actualizarPerfil = async (req, res, next) => {
  try { res.json(await perfilService.actualizarPerfil(req.user.id, req.body.nombre)) }
  catch (err) { next(err) }
}

const confirmarPagoEfectivo = async (req, res, next) => {
  try { res.json(await perfilService.confirmarPagoEfectivo(req.user.id, req.params.pedidoId)) }
  catch (err) { next(err) }
}

module.exports = { getPerfil, getMisPedidos, actualizarPerfil, confirmarPagoEfectivo }
