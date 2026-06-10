const pedidoService = require('../services/pedidoService')

const registrarPedidoPublico = async (req, res, next) => {
  try {
    const { fk_negocio_id, mensaje_generado } = req.body
    const data = await pedidoService.registrarPedidoPublico(fk_negocio_id, mensaje_generado)
    res.json(data)
  } catch (err) { next(err) }
}

module.exports = { registrarPedidoPublico }
