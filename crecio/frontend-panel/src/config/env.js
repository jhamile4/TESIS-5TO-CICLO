export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
export const PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL || 'http://localhost:5173'

// Dirección pública de la tienda de un negocio (la que se comparte y va en el QR)
export const tiendaUrl = (negocioId) => `${PUBLIC_URL}/tienda/${negocioId}`
export const sinProtocolo = (url) => url.replace(/^https?:\/\//, '')
export const qrUrl = (url, size = 360) => `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`
