import { API_URL as BASE_URL } from '../config/env'

const request = async (path, options = {}) => {
  const token = localStorage.getItem('crecio_admin_token')
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'No se pudo procesar la solicitud')
  return data
}

export const iniciarSesion = async (email, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'No se pudo iniciar sesión')
  if (!data.roles?.esEmprendedor) throw new Error('Esta cuenta no tiene un negocio registrado')
  return data
}

export const getResumen = () => request('/admin/resumen')
export const getInventario = () => request('/admin/inventario')
export const getVentas = () => request('/admin/ventas')
export const getClientes = () => request('/admin/clientes')
export const getFinanzas = () => request('/admin/finanzas')
export const generarMarketing = (contenido) => request('/admin/marketing/generar', {
  method: 'POST',
  body: JSON.stringify(contenido),
})
export const crearProducto = (producto) => request('/admin/productos', {
  method: 'POST',
  body: JSON.stringify(producto),
})
