import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PUBLIC_URL } from '../config/env'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#f8fafc',
        color: '#0d9488',
        fontWeight: '700',
        fontSize: '15px'
      }}>
        Cargando sesión de Crecio...
      </div>
    )
  }

  if (!user) {
    window.location.replace(`${PUBLIC_URL}`)
    return null
  }

  return <Outlet />
}
