const adminService = require('./admin.service')

const getResumen = async (req, res, next) => {
  try {
    const resumen = await adminService.getResumen(req.user.id)
    res.json(resumen)
  } catch (error) {
    next(error)
  }
}

const getInventario = async (req, res, next) => {
  try {
    const inventario = await adminService.getInventario(req.user.id)
    res.json(inventario)
  } catch (error) {
    next(error)
  }
}

module.exports = { getResumen, getInventario }
