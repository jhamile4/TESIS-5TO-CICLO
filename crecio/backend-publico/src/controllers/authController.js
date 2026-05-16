const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const pool   = require('../db/db');

// Genera un token JWT firmado con el secreto del .env; expira en 7 días
const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

// Registra un nuevo cliente: valida campos, verifica email único, encripta contraseña y devuelve token
const register = async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password)
    return res.status(400).json({ message: 'Todos los campos son requeridos' });

  try {
    // Verifica que el email no esté ya registrado
    const existing = await pool.query(
      'SELECT pk_id FROM cliente WHERE email = $1', [email]
    );
    if (existing.rows.length > 0)
      return res.status(409).json({ message: 'El email ya está registrado' });

    // Encripta la contraseña con bcrypt (10 rondas de sal)
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO cliente (nombre, email, password) VALUES ($1, $2, $3) RETURNING pk_id, nombre, email, rol',
      [nombre, email, hashedPassword]
    );

    const cliente = result.rows[0];
    const token   = generateToken({ pk_id: cliente.pk_id, email: cliente.email });
    res.status(201).json({
      token,
      usuario: { pk_id: cliente.pk_id, nombre: cliente.nombre, email: cliente.email, rol: cliente.rol },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar', error: error.message });
  }
};

// Inicia sesión: valida credenciales y devuelve token JWT si son correctas
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email y contraseña requeridos' });

  try {
    const result = await pool.query(
      'SELECT pk_id, nombre, email, rol, password FROM cliente WHERE email = $1', [email]
    );

    if (result.rows.length === 0)
      return res.status(401).json({ message: 'Credenciales incorrectas' });

    const cliente = result.rows[0];

    // Compara la contraseña ingresada con el hash guardado en la BD
    const passwordValida = await bcrypt.compare(password, cliente.password);
    if (!passwordValida)
      return res.status(401).json({ message: 'Credenciales incorrectas' });

    const token = generateToken({ pk_id: cliente.pk_id, email: cliente.email });
    res.json({
      token,
      usuario: { pk_id: cliente.pk_id, nombre: cliente.nombre, email: cliente.email, rol: cliente.rol },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

// Devuelve los datos del cliente autenticado (requiere token válido en el header)
const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT pk_id, nombre, email, rol, created_at FROM cliente WHERE pk_id = $1',
      [req.user.pk_id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Cliente no encontrado' });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener perfil', error: error.message });
  }
};

module.exports = { register, login, getMe };
