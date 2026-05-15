import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, getMyOrders } from '../../services/api';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [usuario, setUsuario]   = useState(null);
  const [pedidos, setPedidos]   = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [me, orders] = await Promise.all([getMe(), getMyOrders()]);
        setUsuario(me);
        setPedidos(orders);
      } catch {
        // Token inválido o expirado — limpiar y redirigir
        localStorage.removeItem('crecio_token');
        window.location.href = '/login';
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCerrarSesion = () => {
    localStorage.removeItem('crecio_token');
    window.location.href = '/'; // recarga completa para actualizar el Navbar
  };

  const iniciales = usuario?.nombre
    ? usuario.nombre.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '';

  const formatFecha = (iso) =>
    new Date(iso).toLocaleDateString('es-PE', {
      day: '2-digit', month: 'long', year: 'numeric',
    });

  if (cargando) return <div className={styles.estado}>Cargando perfil...</div>;

  return (
    <div className={styles.pagina}>

      {/* Tarjeta de perfil */}
      <div className={styles.card}>
        <div className={styles.avatarGrande}>{iniciales}</div>
        <div className={styles.info}>
          <h1 className={styles.nombre}>{usuario.nombre}</h1>
          <p className={styles.email}>{usuario.email}</p>
          <span className={styles.rol}>{usuario.rol}</span>
        </div>
        <button className={styles.btnCerrar} onClick={handleCerrarSesion}>
          Cerrar sesión
        </button>
      </div>

      {/* Historial de pedidos */}
      <div className={styles.seccion}>
        <h2 className={styles.seccionTitulo}>Mis pedidos por WhatsApp</h2>

        {pedidos.length === 0 ? (
          <div className={styles.vacio}>
            <p>Aún no has realizado ningún pedido.</p>
            <button className={styles.btnMarketplace} onClick={() => navigate('/marketplace')}>
              Ver marketplace
            </button>
          </div>
        ) : (
          <div className={styles.lista}>
            {pedidos.map((p) => (
              <div key={p.pk_id} className={styles.pedido}>
                {p.imagen_url ? (
                  <img src={p.imagen_url} alt={p.producto} className={styles.pedidoImg} />
                ) : (
                  <div className={styles.pedidoImgPlaceholder} />
                )}
                <div className={styles.pedidoInfo}>
                  <p className={styles.pedidoProducto}>{p.producto}</p>
                  <p className={styles.pedidoNegocio}>{p.negocio}</p>
                  <p className={styles.pedidoFecha}>{formatFecha(p.created_at)}</p>
                </div>
                <p className={styles.pedidoPrecio}>S/ {parseFloat(p.precio).toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
