import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-logo">
          <div className="logo-icon"></div>
          CRECIO
        </div>
        <div className="navbar-links">
          <a href="#">Explora Negocios</a>
          <a href="#">Cómo Funciona</a>
          <a href="#">Precios</a>
        </div>
        <div className="navbar-actions">
          <button className="btn-ghost">Iniciar Sesión</button>
          <button className="btn-primary">Crear Tu Tienda →</button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar