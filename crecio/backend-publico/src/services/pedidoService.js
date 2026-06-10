const pedidoModel = require('../models/pedidoModel')

const registrarPedidoPublico = async (negocioId, mensajeGenerado) => {
  await pedidoModel.createWhatsapp(negocioId, mensajeGenerado)
  return { message: 'Pedido registrado correctamente' }
}

module.exports = { registrarPedidoPublico }
