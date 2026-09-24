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

const createProduct = async (req, res, next) => {
  try {
    const producto = await adminService.createProduct(req.user.id, req.body)
    res.status(201).json(producto)
  } catch (error) {
    next(error)
  }
}

const getVentas = async (req, res, next) => {
  try {
    const ventas = await adminService.getVentas(req.user.id)
    res.json(ventas)
  } catch (error) {
    next(error)
  }
}

const getClientes = async (req, res, next) => {
  try {
    const clientes = await adminService.getClientes(req.user.id)
    res.json(clientes)
  } catch (error) {
    next(error)
  }
}

const generateMarketing = async (req, res, next) => {
  try {
    const resultado = await adminService.generateMarketing(req.user.id, req.body)
    res.json(resultado)
  } catch (error) {
    next(error)
  }
}

const getFinanzas = async (req, res, next) => {
  try { res.json(await adminService.getFinanzas(req.user.id)) } catch (error) { next(error) }
}

module.exports = { getResumen, getInventario, createProduct, getVentas, getClientes, getFinanzas, generateMarketing }
