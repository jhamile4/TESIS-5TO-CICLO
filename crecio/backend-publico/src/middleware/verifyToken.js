const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  const cookieToken = req.headers.cookie?.split(';').map((cookie) => cookie.trim()).find((cookie) => cookie.startsWith('panel_token='))?.split('=')[1]
  const token = req.headers['authorization']?.split(' ')[1] || cookieToken
  if (!token)
    return res.status(401).json({ message: 'Token requerido' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Token invalido' })
  }
}

module.exports = verifyToken