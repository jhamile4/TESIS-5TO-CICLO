const authService = require('../services/authService')

const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body.email, req.body.password)
    res.json(data)
  } catch (err) { next(err) }
}

const register = async (req, res, next) => {
  try {
    const data = await authService.register(req.body.nombre, req.body.email, req.body.password)
    res.json(data)
  } catch (err) { next(err) }
}

const registroCompleto = async (req, res, next) => {
  try {
    const data = await authService.registroCompleto(req.body)
    res.json(data)
  } catch (err) { next(err) }
}

const registroComprador = async (req, res, next) => {
  try {
    const { nombre, email, contrasena } = req.body
    const data = await authService.registroComprador(nombre, email, contrasena)
    res.json(data)
  } catch (err) { next(err) }
}

const verificarComprador = async (req, res, next) => {
  try {
    const data = await authService.verificarEmail(req.body.email, req.body.codigo)
    res.json(data)
  } catch (err) { next(err) }
}

const reenviarCodigo = async (req, res, next) => {
  try {
    const data = await authService.reenviarCodigo(req.body.email)
    res.json(data)
  } catch (err) { next(err) }
}

const verificarEmail = async (req, res, next) => {
  try {
    const data = await authService.verificarEmail(req.body.email, req.body.codigo)
    res.json(data)
  } catch (err) { next(err) }
}

module.exports = {
  register, login, registroCompleto, registroComprador,
  verificarComprador, reenviarCodigo, verificarEmail,
}
