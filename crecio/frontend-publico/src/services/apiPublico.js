const BASE_URL = 'http://localhost:3001/api'

const get = async (path, token = null) => {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res  = await fetch(`${BASE_URL}${path}`, { headers })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error en la peticion')
  return data
}

const post = async (path, body, token = null) => {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res  = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error en la peticion')
  return data
}

const tiempoRelativo = (fechaISO) => {
  const ahora = new Date()
  const fecha = new Date(fechaISO)
  const dias  = Math.floor((ahora - fecha) / (1000 * 60 * 60 * 24))
  if (dias === 0) return 'hoy'
  if (dias === 1) return '1 dia atras'
  if (dias < 7)  return `${dias} dias atras`
  if (dias < 14) return '1 semana atras'
  if (dias < 30) return `${Math.floor(dias / 7)} semanas atras`
  if (dias < 60) return '1 mes atras'
  return `${Math.floor(dias / 30)} meses atras`
}

const normalizarNegocio = (n) => ({
  id:        n.pk_id,
  nombre:    n.nombre,
  categoria: n.categoria,
  desc:      n.descripcion,
  img:       n.logo_url,
  rating:    String(n.rating),
  resenas:   String(n.total_resenas),
  direccion: n.direccion,
  distrito:  n.distrito,
  horario:   n.horario,
  telefono:  n.telefono,
  whatsapp:  n.whatsapp,
  verificado: n.verificado,
  latitud:   n.latitud  ? Number(n.latitud)  : null,
  longitud:  n.longitud ? Number(n.longitud) : null,
})

const normalizarProducto = (p) => ({
  pk_id:     p.pk_id,
  nombre:    p.nombre,
  desc:      p.descripcion,
  precio:    p.precio,
  img:       p.imagen_url,
  stock:     p.stock,
  categoria: p.categoria,
})

const normalizarResena = (r) => ({
  nombre:    r.nombre_autor,
  estrellas: r.estrellas,
  texto:     r.texto,
  tiempo:    tiempoRelativo(r.created_at),
})

export const getNegocios = async (search = '') => {
  const query = search ? `?search=${encodeURIComponent(search)}` : ''
  const data  = await get(`/negocios${query}`)
  return data.map(normalizarNegocio)
}

export const getNegocio = async (id) => {
  const data = await get(`/negocios/${id}`)
  return normalizarNegocio(data)
}

export const getProductos = async (negocioId) => {
  const data = await get(`/productos/negocio/${negocioId}`)
  return data.map(normalizarProducto)
}

export const getResenas = async (negocioId) => {
  const data = await get(`/negocios/${negocioId}/resenas`)
  return data.map(normalizarResena)
}

export const getGaleria = async (negocioId) => {
  const data = await get(`/negocios/${negocioId}/galeria`)
  return data.map((img) => img.imagen_url)
}

export const registrarPedidoPublico = async (negocioId, mensajeGenerado) => {
  return post('/pedidos/publico', {
    fk_negocio_id: negocioId,
    mensaje_generado: mensajeGenerado,
  })
}

export const registrarNegocio = async (datos) => {
  return post('/auth/registro', datos)
}

export const loginCliente = async (email, password) => {
  return post('/auth/login', { email, password })
}

export const verificarCodigo = async (email, codigo) => {
  return post('/auth/verificar', { email, codigo })
}

// ── Comprador (cliente que compra, no dueño de negocio) ──
export const registrarComprador = async (datos) => {
  return post('/auth/registro-comprador', datos)
}

export const loginComprador = async (email, password) => {
  return post('/auth/login', { email, password })
}

// ── Stripe ──
export const crearPaymentIntent = async (items, negocioId, token, direccionData = {}) => {
  return post('/stripe/crear-intent', {
    items,
    fk_negocio_id: negocioId,
    ...direccionData,
  }, token)
}

export const confirmarPago = async (paymentIntentId, token) => {
  return post('/stripe/confirmar', { paymentIntentId }, token)
}

export const confirmarPedidoEfectivo = async ({ carrito, negocioId, direccion, ciudad, notas, total }, token) => {
  return post('/stripe/efectivo', {
    items:        carrito,
    fk_negocio_id: negocioId,
    direccion,
    ciudad,
    notas,
    monto_total:  total,
  }, token)
}