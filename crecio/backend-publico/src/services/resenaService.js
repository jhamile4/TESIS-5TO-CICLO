const resenaModel = require('../models/resenaModel')

const getByNegocio = async (negocioId) => {
  const result = await resenaModel.findByNegocio(negocioId)
  return result.rows
}

module.exports = { getByNegocio }
