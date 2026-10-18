const clienteModel = require('../models/clienteModel')
const pedidoModel  = require('../models/pedidoModel')
const productoModel = require('../models/productoModel')

const getPerfil = async (clienteId) => {
  const result = await clienteModel.findById(clienteId)
  if (result.rows.length === 0)
    throw { status: 404, message: 'Usuario no encontrado' }
  return result.rows[0]
}

const getMisPedidos = async (clienteId) => {
  const result = await pedidoModel.findByCliente(clienteId)
  const pedidos = result.rows

  // Completa la imagen de cada producto (los pedidos antiguos no la guardaban)
  const ids = [...new Set(pedidos.flatMap((p) => (p.items || []).map((i) => Number(i.pk_id)).filter(Boolean)))]
  if (ids.length === 0) return pedidos

  const imagenes = new Map((await productoModel.findImagenes(ids)).rows.map((r) => [r.pk_id, r.imagen_url]))
  return pedidos.map((p) => ({
    ...p,
    items: (p.items || []).map((i) => ({ ...i, img: i.img || imagenes.get(Number(i.pk_id)) || null })),
  }))
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
