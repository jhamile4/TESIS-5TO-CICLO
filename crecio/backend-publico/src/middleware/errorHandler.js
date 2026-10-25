const errorHandler = (err, req, res, next) => {
  const status  = err.status  || 500
  const message = err.message || 'Error interno del servidor'

  if (status === 500) console.error('Error no controlado:', err)

  // codigo: lo usa el panel para reconocer errores como el límite del plan
  res.status(status).json(err.codigo ? { message, codigo: err.codigo } : { message })
}

module.exports = errorHandler
