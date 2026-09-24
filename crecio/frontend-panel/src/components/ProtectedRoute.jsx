import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PUBLIC_URL } from '../config/env'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  useEffect(() => {
    if (!loading && !user) window.location.replace(`${PUBLIC_URL}/login`)
  }, [loading, user])
  if (loading) return <main className="login-shell"><p className="muted">Verificando sesión...</p></main>
  return user ? <Outlet /> : <main className="login-shell"><p className="muted">Redirigiendo al inicio de sesión...</p></main>
}
