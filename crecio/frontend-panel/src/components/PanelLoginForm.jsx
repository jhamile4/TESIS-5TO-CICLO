import { useState } from 'react'
import { iniciarSesion } from '../services/apiAdmin'
import { useAuth } from '../context/AuthContext'
import { ChartNoAxesCombined, ArrowRight } from 'lucide-react'

export default function PanelLoginForm() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await iniciarSesion(email, password)
      login(data)
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión. Verifica tus credenciales.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-brand-header">
          <div className="brand-mark small">
            <ChartNoAxesCombined size={24} />
          </div>
          <h2 className="login-brand-title">Crecio Panel</h2>
          <p className="muted">Inicia sesión con tu cuenta de negocio</p>
        </div>

        {error && (
          <div className="toast-error" style={{ marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="panel-login-form">
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu.correo@ejemplo.com"
              className="login-input-field"
            />
          </div>

          <div className="form-group" style={{ marginTop: '16px' }}>
            <label>Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="login-input-field"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-add-product-teal login-submit-btn"
          >
            {loading ? 'Verificando...' : 'Ingresar al Panel'} <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}
