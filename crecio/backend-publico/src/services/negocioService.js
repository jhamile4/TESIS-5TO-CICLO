const negocioModel = require('../models/negocioModel')

const getAll = async (search) => {
  const result = await negocioModel.findAll(search)
  return result.rows
}

const getById = async (id) => {
  const result = await negocioModel.findById(id)
  if (result.rows.length === 0)
    throw { status: 404, message: 'Negocio no encontrado' }
  return result.rows[0]
}

module.exports = { getAll, getById }
