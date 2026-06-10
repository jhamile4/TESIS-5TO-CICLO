const galeriaModel = require('../models/galeriaModel')

const getByNegocio = async (negocioId) => {
  const result = await galeriaModel.findByNegocio(negocioId)
  return result.rows
}

module.exports = { getByNegocio }
