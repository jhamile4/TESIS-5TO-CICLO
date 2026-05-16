import { useState, useEffect } from 'react'
import './Navbar.css'

function Navbar() {
  const token     = localStorage.getItem('crecio_token')
  const enLanding = window.location.pathname === '/'

  const [nombreUsuario, setNombreUsuario] = useState('')

  // Si hay token, obtiene el nombre del cliente autenticado
  useEffect(() => {
    if (!token) return

    fetch('http://localhost:3001/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Token inválido')
        return res.json()
      })
      .then(data => setNombreUsuario(data.nombre || ''))
      .catch(() => {
        // Token expirado o inválido — limpia sesión y recarga
        localStorage.removeItem('crecio_token')
        window.location.reload()
      })
  }, [token])

  // Si estamos en la LandingPage hace scroll suave; si no, navega a la sección
  const irA = (id) => {
    if (enLanding) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.location.href = `/#${id}`
    }
  }

  const handleCerrarSesion = () => {
    localStorage.removeItem('crecio_token')
    window.location.href = '/'
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* Logo — siempre lleva al inicio */}
        <a href="/" className="navbar-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="logo-icon"></div>
          CRECIO
        </a>

        {/* Links de navegación con scroll suave */}
        <div className="navbar-links">
          <button className="navbar-link-btn" onClick={() => irA('directorio')}>
            Explora Negocios
          </button>
          <button className="navbar-link-btn" onClick={() => irA('pasos')}>
            Cómo Funciona
          </button>
          <button className="navbar-link-btn" onClick={() => irA('planes')}>
            Precios
          </button>
        </div>

        {/* Acciones según estado de sesión */}
        <div className="navbar-actions">
          {token ? (
            <>
              {/* Saludo personalizado con el primer nombre */}
              {nombreUsuario && (
                <span style={{ fontSize: '0.875rem', color: '#4a5568', fontWeight: 600 }}>
                  Hola, {nombreUsuario.split(' ')[0]}
                </span>
              )}
              <a href="/perfil" className="btn-ghost">Mi Perfil</a>
              <button className="btn-primary" onClick={handleCerrarSesion}>
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="btn-ghost">Iniciar Sesión</a>
              <a href="/register" className="btn-primary">Crear Tu Tienda →</a>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}

export default Navbar