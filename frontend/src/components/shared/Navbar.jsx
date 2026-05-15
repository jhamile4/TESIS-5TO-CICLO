import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMe } from '../../services/api';
import styles from './Navbar.module.css';

export default function Navbar() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('crecio_token');
    if (token) {
      getMe()
        .then(data => setUsuario(data))
        .catch(() => {
          localStorage.removeItem('crecio_token');
          setUsuario(null);
        });
    }
  }, []);

  const handleCerrarSesion = () => {
    localStorage.removeItem('crecio_token');
    setUsuario(null);
    window.location.href = '/';
  };

  // Iniciales del nombre para el avatar
  const iniciales = usuario?.nombre
    ? usuario.nombre.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '';

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>CRECIO</Link>

      {/* Links de navegación centrales */}
      <div className={styles.navLinks}>
        <Link to="/marketplace" className={styles.link}>Explorar Negocios</Link>
        <a href="/#como-funciona" className={styles.link}>Cómo Funciona</a>
        <a href="/#precios" className={styles.link}>Precios</a>
        <a href="/#ia-herramientas" className={styles.link}>IA Tool</a>
      </div>

      {/* Botones del lado derecho */}
      <div className={styles.acciones}>
        {usuario ? (
          <div className={styles.usuario}>
            <Link to="/profile" className={styles.avatarBtn}>
              <span className={styles.avatar}>{iniciales}</span>
              <span className={styles.nombre}>{usuario.nombre.split(' ')[0]}</span>
            </Link>
            <button onClick={handleCerrarSesion} className={styles.cerrarBtn}>
              Cerrar sesión
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className={styles.linkBtn}>Iniciar Sesión</Link>
            {/* "Crear mi Tienda" es para el perfil negocio — aún sin funcionalidad */}
            <button className={styles.linkBtnPrimary} disabled title="Próximamente">
              Crear mi Tienda
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
