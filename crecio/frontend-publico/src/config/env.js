// URLs de cada parte del sistema. En producción se definen en las variables de entorno
// del hosting (ver .env.example); en local se usan los puertos de desarrollo.
export const API_URL   = import.meta.env.VITE_API_URL   || 'http://localhost:3001/api'
export const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'http://localhost:5174'
