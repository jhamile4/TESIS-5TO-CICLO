const pool         = require('../config/db')
const resenaModel  = require('../models/resenaModel')
const clienteModel = require('../models/clienteModel')

const getByNegocio = async (negocioId) => {
  const result = await resenaModel.findByNegocio(negocioId)
  return result.rows
}

// "Aline Broncano Macavilca" → "Aline B." para no exponer el nombre completo
const nombrePublico = (nombre = '') => {
  const [primero, segundo] = nombre.trim().split(/\s+/)
  return segundo ? `${primero} ${segundo.charAt(0).toUpperCase()}.` : (primero || 'Cliente')
}

const crear = async (clienteId, negocioId, { pedidoId, estrellas, texto }) => {
  const puntaje = Number(estrellas)
  if (!Number.isInteger(puntaje) || puntaje < 1 || puntaje > 5)
    throw { status: 400, message: 'La calificación debe ser de 1 a 5 estrellas' }
  const comentario = (texto || '').trim()
  if (comentario.length > 500)
    throw { status: 400, message: 'La reseña puede tener como máximo 500 caracteres' }
  if (!pedidoId)
    throw { status: 400, message: 'Indica el pedido que quieres reseñar' }

  const cliente = (await clienteModel.findById(clienteId)).rows[0]
  if (!cliente) throw { status: 404, message: 'Usuario no encontrado' }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Solo quien compró y recibió el pedido puede reseñar, y una sola vez
    const pedido = (await resenaModel.findPedidoParaResena(client, clienteId, negocioId, pedidoId)).rows[0]
    if (!pedido)
      throw { status: 404, message: 'No encontramos ese pedido en esta tienda' }
    if (pedido.estado_pedido !== 'entregado')
      throw { status: 400, message: 'Podrás dejar tu reseña cuando recibas el pedido' }
    if (pedido.resenado)
      throw { status: 409, message: 'Ya dejaste una reseña para este pedido' }

    const resena = (await resenaModel.create(client, {
      negocioId, clienteId, pedidoId,
      nombreAutor: nombrePublico(cliente.nombre),
      estrellas: puntaje,
      texto: comentario || null,
    })).rows[0]
    const negocio = (await resenaModel.recalcularRating(client, negocioId)).rows[0]

    await client.query('COMMIT')
    return { resena, negocio: { rating: Number(negocio.rating), totalResenas: negocio.total_resenas } }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

module.exports = { getByNegocio, crear }
