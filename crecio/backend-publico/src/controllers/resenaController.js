const resenaService = require('../services/resenaService')

const getByNegocio = async (req, res, next) => {
  try {
    const data = await resenaService.getByNegocio(req.params.id)
    res.json(data)
  } catch (err) { next(err) }
}

const crear = async (req, res, next) => {
  try {
    const data = await resenaService.crear(req.user.id, Number(req.params.id), req.body)
    res.status(201).json(data)
  } catch (err) { next(err) }
}

module.exports = { getByNegocio, crear }
