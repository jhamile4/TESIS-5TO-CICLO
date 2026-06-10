const negocioService = require('../services/negocioService')

const getAll = async (req, res, next) => {
  try {
    const data = await negocioService.getAll(req.query.search)
    res.json(data)
  } catch (err) { next(err) }
}

const getById = async (req, res, next) => {
  try {
    const data = await negocioService.getById(req.params.id)
    res.json(data)
  } catch (err) { next(err) }
}

module.exports = { getAll, getById }
