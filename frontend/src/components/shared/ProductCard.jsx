import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../services/api';
import styles from './ProductCard.module.css';

// Tarjeta de producto: muestra imagen, nombre, precio y botón de WhatsApp
// Si el cliente no tiene sesión, redirige al login al intentar pedir
export default function ProductCard({ product, whatsapp, negocioId }) {
  const navigate = useNavigate();

  // Formatea el precio a 2 decimales (ej. 12.5 → "12.50")
  const precio = parseFloat(product.precio).toFixed(2);

  const handleWhatsApp = async () => {
    const token = localStorage.getItem('crecio_token');

    // Sin sesión → pedir que inicie sesión antes de continuar
    if (!token) {
      navigate('/login');
      return;
    }

    // Con sesión → construye el mensaje y abre WhatsApp en una nueva pestaña
    const mensaje = `Hola, me interesa el producto: ${product.nombre} (S/ ${precio})`;
    const numero  = whatsapp?.replace(/\D/g, ''); // elimina caracteres no numéricos del número
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, '_blank');

    // Registra el pedido en la base de datos de forma silenciosa (no bloquea la UI si falla)
    if (negocioId) {
      try {
        await createOrder({ fk_producto_id: product.pk_id, fk_negocio_id: negocioId });
      } catch {
        // Error ignorado intencionalmente — el pedido en WhatsApp ya fue abierto
      }
    }
  };

  // Verifica el token aquí también para mostrar el texto correcto en el botón
  const token = localStorage.getItem('crecio_token');

  return (
    <div className={styles.card}>
      {/* Imagen del producto o placeholder si no tiene */}
      {product.imagen_url ? (
        <img src={product.imagen_url} alt={product.nombre} className={styles.imagen} />
      ) : (
        <div className={styles.imagenPlaceholder}>Sin imagen</div>
      )}

      <div className={styles.body}>
        <p className={styles.categoria}>{product.categoria}</p>
        <h4 className={styles.nombre}>{product.nombre}</h4>
        <p className={styles.precio}>S/ {precio}</p>

        {/* Texto del botón cambia según si hay sesión activa o no */}
        <button className={styles.btn} onClick={handleWhatsApp}>
          {token ? 'Pedir por WhatsApp' : 'Inicia sesión para pedir'}
        </button>
      </div>
    </div>
  );
}
