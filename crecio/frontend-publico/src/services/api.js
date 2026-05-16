const BASE_URL = 'http://localhost:3001/api'

// Lee el token guardado en localStorage
const getToken = () => localStorage.getItem('crecio_token')

// Genera el header de autorización si hay token activo
const authHeader = () => {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Función base para todas las peticiones al backend
const request = async (method, path, body = null, auth = false) => {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) Object.assign(headers, authHeader())

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error en la petición')
  return data
}

// ── Autenticación ─────────────────────────────────────────────────────────────

// Inicia sesión → retorna { token, usuario }
export const login = (data) => request('POST', '/auth/login', data)

// Registra un cliente nuevo → retorna { token, usuario }
export const register = (data) => request('POST', '/auth/register', data)

// Obtiene los datos del cliente autenticado → retorna { pk_id, nombre, email, rol }
export const getMe = () => request('GET', '/auth/me', null, true)

// ── Pedidos ───────────────────────────────────────────────────────────────────

// Historial de pedidos del cliente → retorna array de pedidos
export const getMyOrders = () => request('GET', '/pedidos/mis-pedidos', null, true)
