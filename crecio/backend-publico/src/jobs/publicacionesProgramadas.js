const crypto       = require('crypto')
const adminService = require('../modules/admin/admin.service')

const CADA_MS = 60 * 1000
let ejecutando = false

// Publica las programadas cuya hora ya llegó. Si una vuelta sigue en curso, no empieza otra.
const ejecutar = async () => {
  if (ejecutando) return { omitido: true }
  ejecutando = true
  try {
    const resumen = await adminService.publicarProgramadasPendientes()
    if (resumen.publicadas || resumen.fallidas)
      console.log(`Programadas: ${resumen.publicadas} publicadas, ${resumen.fallidas} fallidas`)
    return resumen
  } catch (err) {
    console.error('Error al publicar programadas:', err.message || err)
    return { error: true }
  } finally {
    ejecutando = false
  }
}

const iniciar = () => {
  setTimeout(ejecutar, 5000)
  setInterval(ejecutar, CADA_MS)
}

// En hosting gratuito el servidor se duerme y deja de revisar. Un servicio externo
// (por ejemplo cron-job.org) puede llamar a esta ruta cada 5 minutos con la cabecera
// x-cron-secret: así lo despierta y publica lo pendiente.
const rutaExterna = async (req, res) => {
  const secreto = process.env.CRON_SECRET || ''
  const recibido = String(req.headers['x-cron-secret'] || '')
  const valido = secreto.length >= 16 && recibido.length === secreto.length &&
    crypto.timingSafeEqual(Buffer.from(recibido), Buffer.from(secreto))
  if (!valido) return res.status(401).json({ message: 'No autorizado' })
  res.json(await ejecutar())
}

module.exports = { iniciar, ejecutar, rutaExterna }
