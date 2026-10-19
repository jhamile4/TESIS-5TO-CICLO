const crypto = require('crypto')
const { createClient } = require('@supabase/supabase-js')

const BUCKET = 'imagenes'
const EXTENSIONES = { 'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }
const MAX_BYTES = 8 * 1024 * 1024 // Instagram acepta imágenes de hasta 8 MB

let supabase = null
const cliente = () => {
  if (!supabase) {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY)
      throw { status: 500, message: 'Falta configurar SUPABASE_URL y SUPABASE_SERVICE_KEY para subir imágenes' }
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
  }
  return supabase
}

// Convierte una imagen en base64 (data:image/...) en un archivo de Supabase Storage y
// devuelve su URL pública. Si ya es una URL http(s), la devuelve tal cual.
// Las redes sociales solo aceptan imágenes con URL pública.
const asegurarUrlPublica = async (imagen, carpeta = 'general') => {
  if (!imagen) return null
  if (/^https?:\/\//i.test(imagen)) return imagen

  const match = /^data:(image\/[a-z+]+);base64,(.+)$/i.exec(imagen)
  if (!match) throw { status: 400, message: 'El formato de la imagen no es válido' }

  const tipo = match[1].toLowerCase()
  const extension = EXTENSIONES[tipo]
  if (!extension) throw { status: 400, message: 'Usa una imagen JPG, PNG o WEBP' }

  const buffer = Buffer.from(match[2], 'base64')
  if (buffer.length > MAX_BYTES) throw { status: 400, message: 'La imagen pesa más de 8 MB' }

  const ruta = `${carpeta}/${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${extension}`
  const { error } = await cliente().storage.from(BUCKET).upload(ruta, buffer, { contentType: tipo, upsert: false })
  if (error) throw { status: 502, message: `No se pudo subir la imagen: ${error.message}` }

  return cliente().storage.from(BUCKET).getPublicUrl(ruta).data.publicUrl
}

module.exports = { asegurarUrlPublica }
