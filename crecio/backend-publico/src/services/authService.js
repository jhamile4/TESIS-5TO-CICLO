const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const pool   = require('../config/db')
const clienteModel = require('../models/clienteModel')
const negocioModel = require('../models/negocioModel')
const { enviarCodigoVerificacion } = require('../utils/email')

const geocodificar = async (direccion) => {
  try {
    const query = encodeURIComponent(direccion + ', Perú')
    const res   = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=pe`,
      { headers: { 'User-Agent': 'CRECIO-App/1.0' } }
    )
    const data = await res.json()
    if (data.length > 0)
      return { latitud: parseFloat(data[0].lat), longitud: parseFloat(data[0].lon) }
  } catch (err) {
    console.error('Error geocodificando:', err.message)
  }
  return { latitud: null, longitud: null }
}

const generarCodigo = () => ({
  codigo: Math.floor(100000 + Math.random() * 900000).toString(),
  expira: new Date(Date.now() + 15 * 60 * 1000),
})

const login = async (email, password) => {
  const result  = await clienteModel.findByEmail(email)
  if (result.rows.length === 0)
    throw { status: 400, message: 'Email o contraseña incorrectos' }

  const cliente = result.rows[0]
  const valido  = await bcrypt.compare(password, cliente.password)
  if (!valido)
    throw { status: 400, message: 'Email o contraseña incorrectos' }
  if (!cliente.email_verificado)
    throw { status: 403, message: 'Debes verificar tu correo antes de ingresar' }

  const negocioResult = await negocioModel.findByClienteId(cliente.pk_id)
  const tieneNegocio  = negocioResult.rows.length > 0

  const token = jwt.sign(
    { id: cliente.pk_id, email: cliente.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  return {
    token,
    cliente: { id: cliente.pk_id, nombre: cliente.nombre, email: cliente.email },
    roles: { esEmprendedor: tieneNegocio, esComprador: true, ambos: tieneNegocio },
  }
}

const register = async (nombre, email, password) => {
  const existe = await clienteModel.existeEmail(email)
  if (existe.rows.length > 0)
    throw { status: 400, message: 'El email ya está registrado' }

  const hash   = await bcrypt.hash(password, 10)
  const result = await clienteModel.createSimple(nombre, email, hash)
  return { message: 'Registro exitoso', cliente: result.rows[0] }
}

const registroCompleto = async (datos) => {
  const { nombre, categoria, direccion, descripcion, whatsapp, nombreCompleto, email, contrasena } = datos
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const existe = await client.query('SELECT pk_id FROM cliente WHERE email = $1', [email])
    if (existe.rows.length > 0) {
      await client.query('ROLLBACK')
      throw { status: 400, message: 'El email ya está registrado' }
    }

    const hash   = await bcrypt.hash(contrasena, 10)
    const { codigo, expira } = generarCodigo()

    const clienteResult = await client.query(
      `INSERT INTO cliente (nombre, email, password, codigo_verificacion, codigo_expira, email_verificado)
       VALUES ($1,$2,$3,$4,$5,FALSE) RETURNING pk_id`,
      [nombreCompleto, email, hash, codigo, expira]
    )
    const clienteId = clienteResult.rows[0].pk_id

    let latitud = null, longitud = null
    if (direccion && direccion.trim().length > 3) {
      const coords = await geocodificar(direccion)
      latitud  = coords.latitud
      longitud = coords.longitud
    }

    await negocioModel.create(client, nombre, categoria, descripcion, direccion, whatsapp, latitud, longitud, clienteId)

    await client.query('COMMIT')

    enviarCodigoVerificacion(email, codigo).catch(err =>
      console.error('Error enviando email:', err.message)
    )

    return { message: 'Registro exitoso. Revisa tu correo.' }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const registroComprador = async (nombre, email, contrasena) => {
  if (!nombre || !email || !contrasena)
    throw { status: 400, message: 'Todos los campos son obligatorios' }
  if (contrasena.length < 6)
    throw { status: 400, message: 'La contraseña debe tener al menos 6 caracteres' }

  const existe = await clienteModel.existeEmail(email)
  if (existe.rows.length > 0)
    throw { status: 400, message: 'El email ya está registrado. Inicia sesión.' }

  const hash = await bcrypt.hash(contrasena, 10)
  const { codigo, expira } = generarCodigo()
  await clienteModel.createComprador(nombre, email, hash, codigo, expira)
  await enviarCodigoVerificacion(email, codigo)
  return { message: 'Registro exitoso. Revisa tu correo para el código.' }
}

const verificarEmail = async (email, codigo) => {
  const result = await clienteModel.findParaVerificar(email)
  if (result.rows.length === 0)
    throw { status: 404, message: 'Email no encontrado' }

  const cliente = result.rows[0]
  if (cliente.email_verificado) return { message: 'Email ya verificado' }
  if (cliente.codigo_verificacion !== codigo)
    throw { status: 400, message: 'Código incorrecto' }
  if (new Date() > new Date(cliente.codigo_expira))
    throw { status: 400, message: 'El código expiró. Solicita uno nuevo.' }

  await clienteModel.setEmailVerificado(cliente.pk_id)
  return { message: 'Correo verificado. Ahora inicia sesión.' }
}

const reenviarCodigo = async (email) => {
  const result = await clienteModel.existeEmail(email)
  if (result.rows.length === 0)
    throw { status: 404, message: 'Email no encontrado' }

  const { codigo, expira } = generarCodigo()
  await clienteModel.updateCodigo(email, codigo, expira)
  await enviarCodigoVerificacion(email, codigo)
  return { message: 'Código reenviado' }
}

module.exports = { login, register, registroCompleto, registroComprador, verificarEmail, reenviarCodigo }
