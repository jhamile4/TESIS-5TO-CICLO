const chatService = require('../services/chatService')

const chatNegocio = async (req, res, next) => {
  try {
    const { negocioId, mensaje, historial } = req.body
    const data = await chatService.chatNegocio(negocioId, mensaje, historial)
    res.json(data)
  } catch (err) { next(err) }
}

const chatCrecio = async (req, res, next) => {
  try {
    const { mensaje, historial } = req.body
    const data = await chatService.chatCrecio(mensaje, historial)
    res.json(data)
  } catch (err) { next(err) }
}

module.exports = { chatNegocio, chatCrecio }
