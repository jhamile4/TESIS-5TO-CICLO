const productoService = require('../services/productoService')

const getByNegocio = async (req, res, next) => {
  try {
    const data = await productoService.getByNegocio(req.params.id)
    res.json(data)
  } catch (err) { next(err) }
}

module.exports = { getByNegocio }
