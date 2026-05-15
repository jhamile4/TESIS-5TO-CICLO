import { useState, useEffect, useMemo } from 'react';
import { getBusinesses } from '../../services/api';
import BusinessCard from '../../components/shared/BusinessCard';
import styles from './Marketplace.module.css';

export default function Marketplace() {
  const [negocios, setNegocios]       = useState([]);
  const [search, setSearch]           = useState('');
  const [categoria, setCategoria]     = useState('Todos');
  const [cargando, setCargando]       = useState(true);

  // Carga inicial
  useEffect(() => {
    cargarNegocios('');
  }, []);

  // Debounce al escribir en el buscador
  useEffect(() => {
    const timer = setTimeout(() => {
      cargarNegocios(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const cargarNegocios = async (termino) => {
    setCargando(true);
    try {
      const data = await getBusinesses(termino);
      setNegocios(data);
    } catch {
      setNegocios([]);
    } finally {
      setCargando(false);
    }
  };

  // Categorías únicas extraídas de los negocios cargados
  const categorias = useMemo(() => {
    const unicas = [...new Set(
      negocios
        .map(n => n.categoria)
        .filter(Boolean)
    )].sort();
    return ['Todos', ...unicas];
  }, [negocios]);

  // Si la categoría seleccionada ya no existe en los datos, vuelve a "Todos"
  useEffect(() => {
    if (categoria !== 'Todos' && !categorias.includes(categoria)) {
      setCategoria('Todos');
    }
  }, [categorias, categoria]);

  // Filtro de categoría se aplica en el cliente
  const negociosFiltrados = categoria === 'Todos'
    ? negocios
    : negocios.filter(n =>
        n.categoria?.toLowerCase() === categoria.toLowerCase()
      );

  return (
    <div className={styles.pagina}>

      {/* Encabezado */}
      <div className={styles.header}>
        <h1 className={styles.titulo}>Descubre negocios cerca de ti</h1>
        <p className={styles.subtitulo}>
          Encuentra tiendas, restaurantes y servicios en tu zona.
        </p>
        <input
          type="text"
          className={styles.buscador}
          placeholder="Buscar negocio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filtros de categoría — se generan automáticamente con los negocios cargados */}
      <div className={styles.filtros}>
        {categorias.map((cat) => (
          <button
            key={cat}
            className={`${styles.chip} ${categoria === cat ? styles.chipActivo : ''}`}
            onClick={() => setCategoria(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div className={styles.contenido}>
        {cargando ? (
          <p className={styles.estado}>Cargando negocios...</p>
        ) : negociosFiltrados.length === 0 ? (
          <p className={styles.estado}>🔍 No se encontraron negocios.</p>
        ) : (
          <div className={styles.grid}>
            {negociosFiltrados.map((negocio) => (
              <BusinessCard key={negocio.pk_id} business={negocio} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
