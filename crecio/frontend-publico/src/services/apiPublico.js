// ─────────────────────────────────────────────────────────────────────────────
// apiPublico.js — Funciones para conectar el frontend con el backend-publico
// Todas las rutas aquí son PÚBLICAS (no requieren login)
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = 'http://localhost:3001/api'

// Petición GET simple sin autenticación
const get = async (path) => {
  const res = await fetch(`${BASE_URL}${path}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error en la petición')
  return data
}

// Petición POST simple sin autenticación
const post = async (path, body) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error en la petición')
  return data
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// Convierte una fecha ISO en texto relativo: "2 semanas atrás", "1 mes atrás", etc.
const tiempoRelativo = (fechaISO) => {
  const ahora = new Date()
  const fecha = new Date(fechaISO)
  const diffMs = ahora - fecha
  const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (dias === 0) return 'hoy'
  if (dias === 1) return '1 día atrás'
  if (dias < 7) return `${dias} días atrás`
  if (dias < 14) return '1 semana atrás'
  if (dias < 30) return `${Math.floor(dias / 7)} semanas atrás`
  if (dias < 60) return '1 mes atrás'
  return `${Math.floor(dias / 30)} meses atrás`
}

// Normaliza un objeto negocio del backend al formato que usan los componentes
// de Jhamile (TiendaPage, Directorio, etc.)
//
// Backend devuelve:  { pk_id, nombre, categoria, descripcion, logo_url,
//                      rating, total_resenas, direccion, horario, telefono, whatsapp }
// Componentes usan: { id, nombre, categoria, desc, img,
//                     rating, resenas, direccion, horario, telefono, whatsapp }
const normalizarNegocio = (n) => ({
  id:        n.pk_id,
  nombre:    n.nombre,
  categoria: n.categoria,
  desc:      n.descripcion,       // ← descripcion → desc
  img:       n.logo_url,          // ← logo_url → img
  rating:    String(n.rating),    // ← número → string (igual que datos hardcodeados)
  resenas:   String(n.total_resenas), // ← total_resenas → resenas
  direccion: n.direccion,
  distrito:  n.distrito,
  horario:   n.horario,
  telefono:  n.telefono,
  whatsapp:  n.whatsapp,
  verificado: n.verificado,
})

// Normaliza un producto del backend al formato de los componentes
// Backend: { pk_id, nombre, descripcion, precio, imagen_url, stock, categoria }
// Componente: { nombre, desc, precio, img }
const normalizarProducto = (p) => ({
  pk_id:  p.pk_id,
  nombre: p.nombre,
  desc:   p.descripcion,   // ← descripcion → desc
  precio: p.precio,
  img:    p.imagen_url,    // ← imagen_url → img
  stock:  p.stock,
  categoria: p.categoria,
})

// Normaliza una reseña del backend al formato del componente ResenasList
// Backend: { pk_id, nombre_autor, estrellas, texto, created_at }
// Componente: { nombre, estrellas, texto, tiempo }
const normalizarResena = (r) => ({
  nombre:   r.nombre_autor,                // ← nombre_autor → nombre
  estrellas: r.estrellas,
  texto:     r.texto,
  tiempo:    tiempoRelativo(r.created_at), // ← created_at → tiempo relativo
})

// ── Negocios ──────────────────────────────────────────────────────────────────

// Obtiene todos los negocios activos
// Uso: const negocios = await getNegocios()
export const getNegocios = async (search = '') => {
  const query = search ? `?search=${encodeURIComponent(search)}` : ''
  const data = await get(`/negocios${query}`)
  return data.map(normalizarNegocio)
}

// Obtiene un negocio por su pk_id
// Uso: const negocio = await getNegocio(1)
export const getNegocio = async (id) => {
  const data = await get(`/negocios/${id}`)
  return normalizarNegocio(data)
}

// ── Productos ─────────────────────────────────────────────────────────────────

// Obtiene los productos activos de un negocio
// Uso: const productos = await getProductos(negocioId)
export const getProductos = async (negocioId) => {
  const data = await get(`/productos/negocio/${negocioId}`)
  return data.map(normalizarProducto)
}

// ── Reseñas ───────────────────────────────────────────────────────────────────

// Obtiene las reseñas de un negocio
// Uso: const resenas = await getResenas(negocioId)
export const getResenas = async (negocioId) => {
  const data = await get(`/negocios/${negocioId}/resenas`)
  return data.map(normalizarResena)
}

// ── Galería ───────────────────────────────────────────────────────────────────

// Obtiene las imágenes de la galería de un negocio
// Retorna: array de strings con URLs de imagen (imagen_url)
// Uso: const galeria = await getGaleria(negocioId)
export const getGaleria = async (negocioId) => {
  const data = await get(`/negocios/${negocioId}/galeria`)
  return data.map((img) => img.imagen_url) // solo las URLs, igual que el array hardcodeado
}

// ── Pedidos ───────────────────────────────────────────────────────────────────

// Registra un pedido público (sin login) cuando el cliente hace clic en WhatsApp
// items: [{ fk_producto_id: 1, cantidad: 2 }, ...]
// Uso: await registrarPedidoPublico(negocioId, items, mensajeWhatsApp)
export const registrarPedidoPublico = async (negocioId, items, mensajeGenerado) => {
  return post('/pedidos/publico', {
    fk_negocio_id:    negocioId,
    items:            items,
    mensaje_generado: mensajeGenerado,
  })
}
