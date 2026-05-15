import { Navigate } from 'react-router-dom';

// Si ya hay sesión activa, redirige al marketplace
// Evita que un usuario logueado vea /login o /register
export default function GuestRoute({ children }) {
  const token = localStorage.getItem('crecio_token');
  return token ? <Navigate to="/marketplace" replace /> : children;
}
