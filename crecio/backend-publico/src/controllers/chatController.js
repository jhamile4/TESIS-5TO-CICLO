const Groq = require('groq-sdk')
const pool = require('../db/db')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const chatNegocio = async (req, res) => {
  const { negocioId, mensaje, historial = [] } = req.body

  if (!mensaje || !negocioId)
    return res.status(400).json({ message: 'Faltan datos' })

  try {
    // Info del negocio
    const negocioResult = await pool.query(
      `SELECT nombre, categoria, descripcion, direccion, horario, telefono, whatsapp
       FROM negocio WHERE pk_id = $1`,
      [negocioId]
    )
    if (negocioResult.rows.length === 0)
      return res.status(404).json({ message: 'Negocio no encontrado' })

    const negocio = negocioResult.rows[0]

    // Productos del negocio
    const productosResult = await pool.query(
      `SELECT nombre, descripcion, precio FROM producto
       WHERE fk_negocio_id = $1 AND activo = TRUE LIMIT 20`,
      [negocioId]
    )
    const productos = productosResult.rows

    const productosTexto = productos.length > 0
      ? productos.map(p => `- ${p.nombre}: S/${p.precio}${p.descripcion ? ` (${p.descripcion})` : ''}`).join('\n')
      : 'No hay productos registrados aún.'

    const sistemaPrompt = `Eres el asistente virtual de "${negocio.nombre}", un negocio de ${negocio.categoria} en la plataforma CRECIO.

INFORMACIÓN DEL NEGOCIO:
- Nombre: ${negocio.nombre}
- Categoría: ${negocio.categoria}
- Descripción: ${negocio.descripcion || 'No especificada'}
- Dirección: ${negocio.direccion || 'No especificada'}
- Horario: ${negocio.horario || 'No especificado'}
- Teléfono: ${negocio.telefono || 'No especificado'}
- WhatsApp: ${negocio.whatsapp ? `+${negocio.whatsapp}` : 'No especificado'}

PRODUCTOS DISPONIBLES:
${productosTexto}

INSTRUCCIONES:
- Responde SIEMPRE en español peruano, de forma amable y breve (máximo 3 oraciones)
- Solo responde sobre este negocio y sus productos
- Si preguntan por delivery, di que pueden coordinar por WhatsApp
- Si preguntan por precios, da la info exacta de los productos
- Si no sabes algo, sugiere contactar por WhatsApp
- No inventes información que no esté en el contexto
- Usa un tono amigable y cercano`

    const messages = [
      { role: 'system', content: sistemaPrompt },
      ...historial.slice(-6),
      { role: 'user', content: mensaje },
    ]

    const completion = await groq.chat.completions.create({
      model:       'llama3-8b-8192',
      messages,
      max_tokens:  250,
      temperature: 0.7,
    })

    const respuesta = completion.choices[0].message.content

    res.json({ respuesta, tokens: completion.usage?.total_tokens || 0 })
  } catch (error) {
    console.error('Error Groq:', error.message)
    res.status(500).json({ message: 'Error al procesar el mensaje', error: error.message })
  }
}

module.exports = { chatNegocio }

const chatCrecio = async (req, res) => {
  const { mensaje, historial = [] } = req.body

  if (!mensaje)
    return res.status(400).json({ message: 'Falta el mensaje' })

  const sistemaPrompt = `Eres el asistente virtual de CRECIO, una plataforma SaaS peruana que ayuda a pequeños negocios a digitalizarse.

SOBRE CRECIO:
- CRECIO permite a emprendedores crear su tienda digital en minutos
- Tiene un directorio de negocios locales donde los clientes pueden encontrar tiendas cerca
- Los clientes pueden hacer pedidos por WhatsApp o pagar con tarjeta directamente

PLANES:
- Plan Básico (Gratis): hasta 20 productos, perfil básico, soporte por email
- Plan Pro (S/49/mes o S/39/mes anual): productos ilimitados, IA, dominio personalizado, reportes, soporte 24/7
- Plan Empresarial (S/129/mes): múltiples sucursales, API, usuarios ilimitados, SLA

CÓMO REGISTRARSE:
- Ir a crecio.pe y hacer clic en "Crear mi tienda gratis"
- Completar datos del negocio: nombre, categoría, WhatsApp, dirección
- Verificar el correo con el código que llega al email
- ¡Listo! La tienda queda activa

FUNCIONES PRINCIPALES:
- Catálogo digital con fotos y precios
- Mapa de ubicación del negocio
- Carrito de compras y pago con tarjeta (Stripe)
- Reseñas de clientes
- Galería de fotos
- Asistente IA para responder preguntas de clientes
- Herramientas de IA para generar descripciones (próximamente)

INSTRUCCIONES:
- Responde SIEMPRE en español peruano, amable y breve (máximo 4 oraciones)
- Si preguntan por precios, da los valores exactos en soles
- Si quieren registrarse, guíalos al botón "Crear mi tienda gratis"
- Si tienen dudas técnicas, sugiere escribir a soporte@crecio.pe
- Usa un tono entusiasta y motivador
- Si preguntan algo que no sabes, sé honesto y deriva a soporte`

  try {
    const messages = [
      { role: 'system', content: sistemaPrompt },
      ...historial.slice(-6),
      { role: 'user', content: mensaje },
    ]

    const completion = await groq.chat.completions.create({
      model:       'llama-3.1-8b-instant',
      messages,
      max_tokens:  250,
      temperature: 0.7,
    })

    const respuesta = completion.choices[0].message.content
    res.json({ respuesta })
  } catch (error) {
    console.error('Error Groq CRECIO:', error.message)
    res.status(500).json({ message: 'Error al procesar el mensaje', error: error.message })
  }
}

module.exports = { chatNegocio, chatCrecio }