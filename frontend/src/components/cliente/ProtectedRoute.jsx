import { Navigate } from 'react-router-dom';

// Guard de ruta: si no hay token, redirige al login
// Protege páginas que requieren sesión activa (ej. /profile)
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('crecio_token');
  return token ? children : <Navigate to="/login" replace />;
}
