import './Navbar.css'

import { useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon"></div>
          CRECIO
        </div>
        <div className="navbar-links">
          <a href="#">Explora Negocios</a>
          <a href="#">Como Funciona</a>
          <a href="#">Precios</a>
        </div>
        <div className="navbar-actions">
          <button className="btn-ghost">Iniciar Sesion</button>
          <button className="btn-primary" onClick={() => navigate('/registro')}>
            Crear Tu Tienda →
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar