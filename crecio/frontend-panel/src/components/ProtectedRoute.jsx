import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PanelLoginForm from './PanelLoginForm'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <main className="login-shell">
        <p className="muted font-semibold text-slate-600">Verificando sesión...</p>
      </main>
    )
  }

  return user ? <Outlet /> : <PanelLoginForm />
}
