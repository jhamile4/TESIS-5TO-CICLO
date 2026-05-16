const express    = require('express');
const router     = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

// Ruta pública: registra un nuevo cliente
router.post('/register', register);

// Ruta pública: inicia sesión y devuelve token JWT
router.post('/login', login);

// Ruta protegida: devuelve los datos del cliente autenticado (requiere token)
router.get('/me', verifyToken, getMe);

module.exports = router;
