const jwt = require('jsonwebtoken');

// Guard de ruta: verifica el token JWT antes de dar acceso a rutas protegidas
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // El header debe venir como: "Bearer <token>"
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Token requerido' });

  const token = authHeader.split(' ')[1];

  try {
    // Verifica y decodifica el token con la clave secreta del .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Adjunta los datos del usuario al request
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = verifyToken;
