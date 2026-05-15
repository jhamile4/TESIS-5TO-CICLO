import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBusinessById, getProductsByBusiness } from '../../services/api';
import ProductCard from '../../components/shared/ProductCard';
import styles from './StorePage.module.css';

export default function StorePage() {
  // Obtiene el ID del negocio desde la URL (/store/:id)
  const { id }   = useParams();
  const navigate = useNavigate();

  const [negocio, setNegocio]     = useState(null);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando]   = useState(true);
  const [error, setError]         = useState(false);

  // Carga el negocio y sus productos en paralelo al montar el componente
  useEffect(() => {
    const cargar = async () => {
      try {
        // Promise.all hace las dos peticiones al mismo tiempo para ahorrar tiempo
        const [neg, prods] = await Promise.all([
          getBusinessById(id),
          getProductsByBusiness(id),
        ]);
        setNegocio(neg);
        setProductos(prods);
      } catch {
        // Si el ID no existe o hay error de red, muestra pantalla de error
        setError(true);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [id]); // se vuelve a ejecutar si el ID en la URL cambia

  // Genera iniciales del nombre para el logo placeholder (ej. "Tech Store" → "TS")
  const iniciales = (nombre) =>
    nombre?.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase();

  // Pantalla de carga mientras se obtienen los datos
  if (cargando) {
    return <div className={styles.estado}>Cargando tienda...</div>;
  }

  // Pantalla de error si el negocio no fue encontrado
  if (error || !negocio) {
    return (
      <div className={styles.estado}>
        <p>Negocio no encontrado.</p>
        <button className={styles.btnVolver} onClick={() => navigate('/marketplace')}>
          Volver al marketplace
        </button>
      </div>
    );
  }

  return (
    <div className={styles.pagina}>

      {/* Header del negocio: logo, nombre, categoría, descripción y ubicación */}
      <div className={styles.header}>
        {negocio.logo_url ? (
          <img src={negocio.logo_url} alt={negocio.nombre} className={styles.logo} />
        ) : (
          // Si no tiene logo, muestra las iniciales del nombre
          <div className={styles.logoPlaceholder}>{iniciales(negocio.nombre)}</div>
        )}

        <div className={styles.info}>
          <span className={styles.badge}>{negocio.categoria}</span>
          <h1 className={styles.nombre}>{negocio.nombre}</h1>
          {negocio.descripcion && (
            <p className={styles.descripcion}>{negocio.descripcion}</p>
          )}
          {/* Muestra dirección y/o distrito si al menos uno está disponible */}
          {(negocio.direccion || negocio.distrito) && (
            <p className={styles.ubicacion}>
              📍 {[negocio.direccion, negocio.distrito].filter(Boolean).join(', ')}
            </p>
          )}
        </div>
      </div>

      {/* Catálogo de productos del negocio */}
      <div className={styles.catalogo}>
        <h2 className={styles.catalogoTitulo}>Catálogo</h2>

        {productos.length === 0 ? (
          <p className={styles.sinProductos}>Este negocio aún no tiene productos.</p>
        ) : (
          <div className={styles.grid}>
            {productos.map((producto) => (
              <ProductCard
                key={producto.pk_id}
                product={producto}
                whatsapp={negocio.whatsapp}
                negocioId={negocio.pk_id}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
