import axios from 'axios';

// Instancia de axios con la URL base del backend
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' },
});

// Genera el header Authorization con el token guardado en localStorage
const authHeader = () => {
  const token = localStorage.getItem('crecio_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ── Negocios ──────────────────────────────────────────────────────────────────

// Obtiene todos los negocios activos; acepta un término de búsqueda opcional
export const getBusinesses = (search = '') =>
  api.get('/businesses', { params: search ? { search } : {} }).then(r => r.data);

// Obtiene un negocio por su ID
export const getBusinessById = (id) =>
  api.get(`/businesses/${id}`).then(r => r.data);

// ── Productos ─────────────────────────────────────────────────────────────────

// Obtiene los productos activos de un negocio específico
export const getProductsByBusiness = (businessId) =>
  api.get(`/products/business/${businessId}`).then(r => r.data);

// ── Autenticación ─────────────────────────────────────────────────────────────

// Inicia sesión con email y contraseña; devuelve { token }
export const login = (data) =>
  api.post('/auth/login', data).then(r => r.data);

// Registra un nuevo cliente; devuelve { token }
export const register = (data) =>
  api.post('/auth/register', data).then(r => r.data);

// Obtiene el perfil del cliente autenticado usando el token almacenado
export const getMe = () =>
  api.get('/auth/me', { headers: authHeader() }).then(r => r.data);

// ── Pedidos ───────────────────────────────────────────────────────────────────

// Registra un pedido por WhatsApp (requiere sesión activa)
export const createOrder = (data) =>
  api.post('/orders', data, { headers: authHeader() }).then(r => r.data);

// Obtiene el historial de pedidos del cliente autenticado
export const getMyOrders = () =>
  api.get('/orders/my', { headers: authHeader() }).then(r => r.data);
