import { useState } from 'react'
import { Link } from 'react-router-dom'
import { register } from '../../services/api'
import './RegisterPage.css'

export default function RegisterPage() {
  const [form, setForm]         = useState({ nombre: '', email: '', password: '' })
  const [error, setError]       = useState('')
  const [cargando, setCargando] = useState(false)

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      const { token } = await register(form)
      localStorage.setItem('crecio_token', token)
      window.location.href = '/'
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="auth-pagina">
      <div className="auth-card">

        <div className="auth-logo">CRECIO</div>
        <h1 className="auth-titulo">Crear cuenta</h1>
        <p className="auth-subtitulo">Únete a CRECIO gratis</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-campo">
            <label className="auth-label">Nombre completo</label>
            <input
              type="text"
              name="nombre"
              className="auth-input"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              required
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-btn" disabled={cargando}>
            {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="auth-link-texto">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="auth-link">Inicia sesión</Link>
        </p>

      </div>
    </div>
  )
}
