// Precios en céntimos (Stripe trabaja en la unidad mínima de la moneda). Ya incluyen IGV.
// El anual equivale a 10 meses: 2 meses gratis.
const PLANES = {
  pro:       { nombre: 'CRECIO Pro',       monto: 3900,  meses: 1  },
  pro_anual: { nombre: 'CRECIO Pro Anual', monto: 39000, meses: 12 },
}

// Qué incluye cada plan. null = sin límite
const LIMITES_PLAN = {
  gratis: { productos: 20,   usosIaMes: 10,   fotosGaleria: 3, publicarEnRedes: false },
  pro:    { productos: null, usosIaMes: null, fotosGaleria: 8, publicarEnRedes: true  },
}

// Modelo de Groq para chatbots y marketing. Groq retira modelos cada cierto tiempo
// (llama-3.1-8b-instant ya no existe): si pasa, se cambia aquí o con GROQ_MODEL en el .env
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b'

const ENVIO_GRATIS_DESDE   = 200
const COSTO_ENVIO          = 15
const MAX_HISTORIAL_CHAT   = 6
const MAX_PRODUCTOS_CHAT   = 20
const VISTOS_LIMITE        = 10
const PARA_TI_LIMITE       = 6
const BUSCAR_PRODUCTOS_LIM = 8
const BUSCAR_NEGOCIOS_LIM  = 4

module.exports = {
  GROQ_MODEL,
  PLANES,
  LIMITES_PLAN,
  ENVIO_GRATIS_DESDE,
  COSTO_ENVIO,
  MAX_HISTORIAL_CHAT,
  MAX_PRODUCTOS_CHAT,
  VISTOS_LIMITE,
  PARA_TI_LIMITE,
  BUSCAR_PRODUCTOS_LIM,
  BUSCAR_NEGOCIOS_LIM,
}
