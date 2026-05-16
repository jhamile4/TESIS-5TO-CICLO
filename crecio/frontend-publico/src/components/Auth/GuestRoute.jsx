import { Navigate } from 'react-router-dom'

// Guard: si ya hay sesión activa, redirige al perfil
// Evita que un usuario logueado vea /login o /register
export default function GuestRoute({ children }) {
  const token = localStorage.getItem('crecio_token')
  return token ? <Navigate to="/perfil" replace /> : children
}
