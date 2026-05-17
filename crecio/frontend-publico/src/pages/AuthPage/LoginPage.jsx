// Página de inicio de sesión
// Al autenticarse correctamente guarda el token en localStorage y redirige al inicio
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { login } from '../../services/api'
import './LoginPage.css'

export default function LoginPage() {
  const [form, setForm]         = useState({ email: '', password: '' })
  const [error, setError]       = useState('')
  const [cargando, setCargando] = useState(false)

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  // Envía credenciales al backend; si son válidas guarda el token y redirige
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      const { token } = await login(form)
      localStorage.setItem('crecio_token', token)
      window.location.href = '/'
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="auth-pagina">
      <div className="auth-card">

        <div className="auth-logo">CRECIO</div>
        <h1 className="auth-titulo">Iniciar sesión</h1>
        <p className="auth-subtitulo">Bienvenido de nuevo</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-campo">
            <label className="auth-label">Email</label>
            <input
              type="email"
              name="email"
              className="auth-input"
              value={form.email}
              onChange={handleChange}
              placeholder="tucorreo@email.com"
              required
            />
          </div>

          <div className="auth-campo">
            <label className="auth-label">Contraseña</label>
            <input
              type="password"
              name="password"
              className="auth-input"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-btn" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="auth-link-texto">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="auth-link">Regístrate gratis</Link>
        </p>

      </div>
    </div>
  )
}
