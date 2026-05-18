const pool = require('../db/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
  const { nombre, email, password } = req.body
  try {
    const existe = await pool.query('SELECT pk_id FROM cliente WHERE email = $1', [email])
    if (existe.rows.length > 0)
      return res.status(400).json({ message: 'El email ya esta registrado' })

    const hash = await bcrypt.hash(password, 10)
    const result = await pool.query(
      `INSERT INTO cliente (nombre, email, password)
       VALUES ($1, $2, $3) RETURNING pk_id, nombre, email`,
      [nombre, email, hash]
    )
    res.json({ message: 'Registro exitoso', cliente: result.rows[0] })
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar', error: error.message })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const result = await pool.query('SELECT * FROM cliente WHERE email = $1', [email])
    if (result.rows.length === 0)
      return res.status(400).json({ message: 'Email o contrasena incorrectos' })

    const cliente = result.rows[0]
    const valido = await bcrypt.compare(password, cliente.password)
    if (!valido)
      return res.status(400).json({ message: 'Email o contrasena incorrectos' })

    const token = jwt.sign(
      { id: cliente.pk_id, email: cliente.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    res.json({ token, cliente: { id: cliente.pk_id, nombre: cliente.nombre, email: cliente.email } })
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesion', error: error.message })
  }
}

module.exports = { register, login }