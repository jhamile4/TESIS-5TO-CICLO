import { useNavigate } from 'react-router-dom';
import styles from './BusinessCard.module.css';

// Tarjeta que muestra el resumen de un negocio en el Marketplace
// Al hacer clic en "Ver tienda" navega a /store/:id
export default function BusinessCard({ business }) {
  const navigate = useNavigate();

  return (
    <div className={styles.card}>
      {/* Etiqueta de categoría del negocio */}
      <span className={styles.badge}>{business.categoria}</span>

      <h3 className={styles.nombre}>{business.nombre}</h3>
      <p className={styles.descripcion}>{business.descripcion}</p>

      {/* Muestra el distrito solo si está disponible */}
      {business.distrito && (
        <p className={styles.distrito}>📍 {business.distrito}</p>
      )}

      <button
        className={styles.btn}
        onClick={() => navigate(`/store/${business.pk_id}`)}
      >
        Ver tienda
      </button>
    </div>
  );
}
