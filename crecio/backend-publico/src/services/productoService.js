const productoModel = require('../models/productoModel')

const getByNegocio = async (negocioId) => {
  const result = await productoModel.findByNegocio(negocioId)
  return result.rows
}

module.exports = { getByNegocio }
