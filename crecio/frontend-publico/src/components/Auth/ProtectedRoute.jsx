import { Navigate } from 'react-router-dom'

// Guard: si no hay token activo, redirige al login
// Protege páginas que requieren sesión (ej. /perfil)
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('crecio_token')
  return token ? children : <Navigate to="/login" replace />
}
