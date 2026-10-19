const authService = require('../services/authService')

const setPanelCookie = (res, token) => {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  res.setHeader('Set-Cookie', `panel_token=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800${secure}`)
}

const clearPanelCookie = (res) => {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  res.setHeader('Set-Cookie', `panel_token=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${secure}`)
}

const getSession = async (req, res, next) => {
  try {
    const cliente = await authService.getSessionData(req.user.id)
    // Devuelve el token para que el panel lo guarde: así su sesión no cambia
    // si en otra pestaña de localhost se inicia sesión con otra cuenta (la cookie es compartida)
    res.json({ cliente: cliente || { id: req.user.id, email: req.user.email }, token: req.token })
  } catch (err) {
    next(err)
  }
}

const logout = (req, res) => {
  clearPanelCookie(res)
  res.json({ message: 'Sesion cerrada' })
}

const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body.email, req.body.password)
    setPanelCookie(res, data.token)
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

const solicitarRecuperacion = async (req, res, next) => {
  try {
    res.json(await authService.solicitarRecuperacion(req.body.email))
  } catch (err) { next(err) }
}

const restablecerPassword = async (req, res, next) => {
  try {
    const { email, codigo, nueva } = req.body
    res.json(await authService.restablecerPassword(email, codigo, nueva))
  } catch (err) { next(err) }
}

const cambiarPassword = async (req, res, next) => {
  try {
    const { actual, nueva } = req.body
    res.json(await authService.cambiarPassword(req.user.id, actual, nueva))
  } catch (err) { next(err) }
}

module.exports = {
  register, login, registroCompleto, registroComprador,
  verificarComprador, reenviarCodigo, verificarEmail, getSession, logout,
  solicitarRecuperacion, restablecerPassword, cambiarPassword,
}
