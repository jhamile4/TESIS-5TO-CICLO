const pool = require('../db/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { enviarCodigoVerificacion } = require('../utils/email')

// ── Geocodificar ──
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

// ── Login ──
const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const result = await pool.query('SELECT * FROM cliente WHERE email = $1', [email])
    if (result.rows.length === 0)
      return res.status(400).json({ message: 'Email o contraseña incorrectos' })

    const cliente = result.rows[0]
    const valido  = await bcrypt.compare(password, cliente.password)
    if (!valido)
      return res.status(400).json({ message: 'Email o contraseña incorrectos' })

    if (!cliente.email_verificado)
      return res.status(403).json({ message: 'Debes verificar tu correo antes de ingresar' })

    const token = jwt.sign(
      { id: cliente.pk_id, email: cliente.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    res.json({ token, cliente: { id: cliente.pk_id, nombre: cliente.nombre, email: cliente.email } })
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message })
  }
}

// ── Registro negocio completo ──
const registroCompleto = async (req, res) => {
  const { nombre, categoria, direccion, descripcion, whatsapp, nombreCompleto, email, contrasena } = req.body
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const existe = await client.query('SELECT pk_id FROM cliente WHERE email = $1', [email])
    if (existe.rows.length > 0) {
      await client.query('ROLLBACK')
      return res.status(400).json({ message: 'El email ya está registrado' })
    }

    const hash   = await bcrypt.hash(contrasena, 10)
    const codigo = Math.floor(100000 + Math.random() * 900000).toString()
    const expira = new Date(Date.now() + 15 * 60 * 1000)

    await client.query(
      `INSERT INTO cliente (nombre, email, password, codigo_verificacion, codigo_expira, email_verificado)
       VALUES ($1,$2,$3,$4,$5,FALSE)`,
      [nombreCompleto, email, hash, codigo, expira]
    )

    let latitud = null, longitud = null
    if (direccion && direccion.trim().length > 3) {
      const coords = await geocodificar(direccion)
      latitud  = coords.latitud
      longitud = coords.longitud
    }

    await client.query(
      `INSERT INTO negocio
         (nombre, categoria, descripcion, logo_url, direccion, distrito, horario, telefono, whatsapp, rating, total_resenas, verificado, activo, latitud, longitud)
       VALUES ($1,$2,$3,'',$4,'','Por confirmar',$5,$5,0,0,FALSE,FALSE,$6,$7)`,
      [nombre, categoria, descripcion || '', direccion || '', whatsapp, latitud, longitud]
    )

    await client.query('COMMIT')

    enviarCodigoVerificacion(email, codigo).catch(err =>
      console.error('Error enviando email:', err.message)
    )

    res.json({ message: 'Registro exitoso. Revisa tu correo.' })
  } catch (error) {
    await client.query('ROLLBACK')
    res.status(500).json({ message: 'Error al registrar', error: error.message })
  } finally {
    client.release()
  }
}

// ── Registro comprador (con código de verificación) ──
const registroComprador = async (req, res) => {
  const { nombre, email, contrasena } = req.body
  try {
    if (!nombre || !email || !contrasena)
      return res.status(400).json({ message: 'Todos los campos son obligatorios' })

    if (contrasena.length < 6)
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' })

    const existe = await pool.query('SELECT pk_id FROM cliente WHERE email = $1', [email])
    if (existe.rows.length > 0)
      return res.status(400).json({ message: 'El email ya está registrado. Inicia sesión.' })

    const hash   = await bcrypt.hash(contrasena, 10)
    const codigo = Math.floor(100000 + Math.random() * 900000).toString()
    const expira = new Date(Date.now() + 15 * 60 * 1000)

    await pool.query(
      `INSERT INTO cliente (nombre, email, password, codigo_verificacion, codigo_expira, email_verificado, es_comprador)
       VALUES ($1,$2,$3,$4,$5,FALSE,TRUE)`,
      [nombre, email, hash, codigo, expira]
    )

    await enviarCodigoVerificacion(email, codigo)

    res.json({ message: 'Registro exitoso. Revisa tu correo para el código.' })
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar', error: error.message })
  }
}

// ── Verificar email comprador ──
const verificarComprador = async (req, res) => {
  const { email, codigo } = req.body
  try {
    const result = await pool.query(
      'SELECT pk_id, codigo_verificacion, codigo_expira, email_verificado FROM cliente WHERE email = $1',
      [email]
    )
    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Email no encontrado' })

    const cliente = result.rows[0]

    if (cliente.email_verificado)
      return res.json({ message: 'Email ya verificado' })

    if (cliente.codigo_verificacion !== codigo)
      return res.status(400).json({ message: 'Código incorrecto' })

    if (new Date() > new Date(cliente.codigo_expira))
      return res.status(400).json({ message: 'El código expiró. Solicita uno nuevo.' })

    await pool.query(
      'UPDATE cliente SET email_verificado = TRUE, codigo_verificacion = NULL, codigo_expira = NULL WHERE pk_id = $1',
      [cliente.pk_id]
    )

    res.json({ message: 'Correo verificado. Ahora inicia sesión.' })
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar', error: error.message })
  }
}

// ── Reenviar código ──
const reenviarCodigo = async (req, res) => {
  const { email } = req.body
  try {
    const result = await pool.query('SELECT pk_id FROM cliente WHERE email = $1', [email])
    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Email no encontrado' })

    const codigo = Math.floor(100000 + Math.random() * 900000).toString()
    const expira = new Date(Date.now() + 15 * 60 * 1000)

    await pool.query(
      'UPDATE cliente SET codigo_verificacion = $1, codigo_expira = $2 WHERE email = $3',
      [codigo, expira, email]
    )

    await enviarCodigoVerificacion(email, codigo)

    res.json({ message: 'Código reenviado' })
  } catch (error) {
    res.status(500).json({ message: 'Error al reenviar código', error: error.message })
  }
}

// ── Verificar email negocio (legacy) ──
const verificarEmail = async (req, res) => {
  const { email, codigo } = req.body
  try {
    const result = await pool.query(
      'SELECT pk_id, codigo_verificacion, codigo_expira, email_verificado FROM cliente WHERE email = $1',
      [email]
    )
    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Email no encontrado' })

    const cliente = result.rows[0]

    if (cliente.email_verificado)
      return res.json({ message: 'Email ya verificado' })

    if (cliente.codigo_verificacion !== codigo)
      return res.status(400).json({ message: 'Codigo incorrecto' })

    if (new Date() > new Date(cliente.codigo_expira))
      return res.status(400).json({ message: 'El codigo ha expirado. Registrate nuevamente.' })

    await pool.query(
      'UPDATE cliente SET email_verificado = TRUE, codigo_verificacion = NULL, codigo_expira = NULL WHERE pk_id = $1',
      [cliente.pk_id]
    )

    res.json({ message: 'Correo verificado correctamente' })
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar', error: error.message })
  }
}

const register = async (req, res) => {
  const { nombre, email, password } = req.body
  try {
    const existe = await pool.query('SELECT pk_id FROM cliente WHERE email = $1', [email])
    if (existe.rows.length > 0)
      return res.status(400).json({ message: 'El email ya esta registrado' })
    const hash   = await bcrypt.hash(password, 10)
    const result = await pool.query(
      `INSERT INTO cliente (nombre, email, password) VALUES ($1,$2,$3) RETURNING pk_id, nombre, email`,
      [nombre, email, hash]
    )
    res.json({ message: 'Registro exitoso', cliente: result.rows[0] })
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar', error: error.message })
  }
}

module.exports = {
  register,
  login,
  registroCompleto,
  registroComprador,
  verificarComprador,
  reenviarCodigo,
  verificarEmail,
}