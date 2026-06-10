const galeriaService = require('../services/galeriaService')

const getByNegocio = async (req, res, next) => {
  try {
    const data = await galeriaService.getByNegocio(req.params.id)
    res.json(data)
  } catch (err) { next(err) }
}

module.exports = { getByNegocio }
