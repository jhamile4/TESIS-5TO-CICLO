const clienteModel = require('../models/clienteModel')
const pedidoModel  = require('../models/pedidoModel')

const getPerfil = async (clienteId) => {
  const result = await clienteModel.findById(clienteId)
  if (result.rows.length === 0)
    throw { status: 404, message: 'Usuario no encontrado' }
  return result.rows[0]
}

const getMisPedidos = async (clienteId) => {
  const result = await pedidoModel.findByCliente(clienteId)
  return result.rows
}

const actualizarPerfil = async (clienteId, nombre) => {
  if (!nombre || nombre.trim().length < 2)
    throw { status: 400, message: 'El nombre debe tener al menos 2 caracteres' }

  const result = await clienteModel.updateNombre(clienteId, nombre.trim())
  return { message: 'Perfil actualizado', cliente: result.rows[0] }
}

const confirmarPagoEfectivo = async (clienteId, pedidoId) => {
  const result = await pedidoModel.confirmEfectivo(pedidoId, clienteId)
  if (result.rows.length === 0)
    throw { status: 404, message: 'Pedido no encontrado o ya confirmado' }
  return { message: 'Pago confirmado', pk_id: result.rows[0].pk_id }
}

module.exports = { getPerfil, getMisPedidos, actualizarPerfil, confirmarPagoEfectivo }
