const resenaService = require('../services/resenaService')

const getByNegocio = async (req, res, next) => {
  try {
    const data = await resenaService.getByNegocio(req.params.id)
    res.json(data)
  } catch (err) { next(err) }
}

module.exports = { getByNegocio }
