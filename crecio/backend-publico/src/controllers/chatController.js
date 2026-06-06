const Groq = require('groq-sdk')
const pool = require('../db/db')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// ── Chat del negocio ──
const chatNegocio = async (req, res) => {
  const { negocioId, mensaje, historial = [] } = req.body
  if (!mensaje || !negocioId)
    return res.status(400).json({ message: 'Faltan datos' })

  try {
    const negocioResult = await pool.query(
      `SELECT nombre, categoria, descripcion, direccion, horario, telefono, whatsapp
       FROM negocio WHERE pk_id = $1`, [negocioId]
    )
    if (negocioResult.rows.length === 0)
      return res.status(404).json({ message: 'Negocio no encontrado' })

    const negocio = negocioResult.rows[0]

    const productosResult = await pool.query(
      `SELECT nombre, descripcion, precio FROM producto
       WHERE fk_negocio_id = $1 AND activo = TRUE LIMIT 20`, [negocioId]
    )
    const productos = productosResult.rows

    const productosTexto = productos.length > 0
      ? productos.map(p => `- ${p.nombre}: S/${p.precio}${p.descripcion ? ` (${p.descripcion})` : ''}`).join('\n')
      : 'No hay productos registrados aún.'

    const sistemaPrompt = `Eres el asistente virtual EXCLUSIVO de "${negocio.nombre}", un negocio de ${negocio.categoria} en la plataforma CRECIO.

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

REGLAS ESTRICTAS — DEBES SEGUIRLAS SIN EXCEPCIÓN:
1. SOLO puedes responder preguntas relacionadas con "${negocio.nombre}", sus productos, precios, horarios, ubicación y servicios.
2. Si te preguntan sobre cualquier otro tema (deportes, política, ciencia, personas famosas, recetas, tecnología general, u CUALQUIER cosa ajena al negocio), responde EXACTAMENTE: "Solo puedo ayudarte con información de ${negocio.nombre}. ¿Tienes alguna consulta sobre nuestros productos o servicios?"
3. NUNCA respondas preguntas sobre otras personas, marcas, negocios o temas generales.
4. NUNCA uses tu conocimiento general — solo la información del negocio que te dieron.
5. Si no sabes algo del negocio, sugiere contactar por WhatsApp.
6. Responde siempre en español, de forma amable y breve (máximo 3 oraciones).`

    const messages = [
      { role: 'system', content: sistemaPrompt },
      ...historial.slice(-6),
      { role: 'user', content: mensaje },
    ]

    const completion = await groq.chat.completions.create({
      model:       'llama-3.1-8b-instant',
      messages,
      max_tokens:  200,
      temperature: 0.3, // Más bajo = más estricto y predecible
    })

    const respuesta = completion.choices[0].message.content
    res.json({ respuesta })
  } catch (error) {
    console.error('Error Groq negocio:', error.message)
    res.status(500).json({ message: 'Error al procesar el mensaje', error: error.message })
  }
}

// ── Chat de la landing (CRECIO) ──
const chatCrecio = async (req, res) => {
  const { mensaje, historial = [] } = req.body
  if (!mensaje) return res.status(400).json({ message: 'Falta el mensaje' })

  const sistemaPrompt = `Eres el asistente virtual oficial de CRECIO, una plataforma SaaS peruana que ayuda a pequeños negocios a digitalizarse.

SOBRE CRECIO:
- CRECIO permite a emprendedores crear su tienda digital en minutos
- Tiene un directorio de negocios locales donde los clientes pueden encontrar tiendas cerca
- Los clientes pueden hacer pedidos por WhatsApp o pagar con tarjeta directamente

PLANES:
- Plan Básico (Gratis): hasta 20 productos, perfil básico, soporte por email
- Plan Pro (S/49/mes o S/39/mes anual): productos ilimitados, IA, dominio personalizado, reportes, soporte 24/7
- Plan Empresarial (S/129/mes): múltiples sucursales, API, usuarios ilimitados, SLA

CÓMO REGISTRARSE:
- Ir a la página y hacer clic en "Crear mi tienda gratis"
- Completar datos del negocio: nombre, categoría, WhatsApp, dirección
- Verificar el correo con el código que llega al email

FUNCIONES PRINCIPALES:
- Catálogo digital con fotos y precios
- Mapa de ubicación del negocio
- Carrito de compras y pago con tarjeta
- Reseñas de clientes
- Asistente IA para responder preguntas de clientes

REGLAS ESTRICTAS:
1. SOLO responde preguntas sobre CRECIO: cómo funciona, planes, precios, registro, funciones.
2. Si te preguntan sobre cualquier otro tema ajeno a CRECIO, responde: "Solo puedo ayudarte con información sobre la plataforma CRECIO. ¿Tienes alguna consulta sobre cómo digitalizar tu negocio?"
3. NUNCA uses tu conocimiento general sobre otros temas.
4. Responde en español peruano, amable y breve (máximo 4 oraciones).
5. Si quieren registrarse, guíalos al botón "Crear mi tienda gratis".`

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
      temperature: 0.3,
    })

    const respuesta = completion.choices[0].message.content
    res.json({ respuesta })
  } catch (error) {
    console.error('Error Groq CRECIO:', error.message)
    res.status(500).json({ message: 'Error al procesar el mensaje', error: error.message })
  }
}

module.exports = { chatNegocio, chatCrecio }