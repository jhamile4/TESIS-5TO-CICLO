import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ShieldCheck } from 'lucide-react'
import NegocioModal from './NegocioModal'
import { negocios as negociosLocales } from '../../data/negociosData'
import './Directorio.css'

// Categorías únicas extraídas de los datos locales
const categoriasIniciales = ['Todos', ...new Set(negociosLocales.map(n => n.categoria))]

function Directorio() {
  const navigate = useNavigate()

  // Estado inicial: datos completos locales (con productos, reviews, slug, etc.)
  const [negocios, setNegocios]         = useState(negociosLocales)
  const [filtros, setFiltros]           = useState(categoriasIniciales)
  const [filtroActivo, setFiltro]       = useState('Todos')
  const [busqueda, setBusqueda]         = useState('')
  const [negocioModal, setNegocioModal] = useState(null)

  // Intenta enriquecer los datos locales con info del backend (rating real, etc.)
  // Si el backend no está corriendo, los datos locales siguen funcionando igual
  useEffect(() => {
    fetch('http://localhost:3001/api/negocios')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Mezcla: mantiene datos locales completos + actualiza rating/resenas del backend
          const enriquecidos = negociosLocales.map((local, i) => {
            const backend = data[i]
            if (!backend) return local
            return {
              ...local,
              rating:    backend.rating       ? String(backend.rating)       : local.rating,
              resenas:   backend.total_resenas ? String(backend.total_resenas) : local.resenas,
              direccion: backend.direccion     ? [backend.direccion, backend.distrito].filter(Boolean).join(', ') : local.direccion,
            }
          })
          setNegocios(enriquecidos)
          const cats = ['Todos', ...new Set(enriquecidos.map(n => n.categoria))]
          setFiltros(cats)
        }
      })
      .catch(() => {
        // Sin backend → datos locales completos, todo funciona igual
      })
  }, [])

  // Filtra por categoría y texto de búsqueda
  const negociosFiltrados = negocios.filter(n => {
    const porCategoria = filtroActivo === 'Todos' || n.categoria === filtroActivo
    const porBusqueda  = n.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return porCategoria && porBusqueda
  })

  return (
    <>
      <section className="directory">

        <div className="directory-header">
          <div className="section-label" style={{ textAlign: 'center' }}>Directorio</div>
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            Descubre negocios{' '}
            <em style={{ color: 'var(--green)', fontStyle: 'normal' }}>en tu localidad</em>
          </h2>
          <p className="directory-sub">
            Encuentra tiendas, restaurantes y servicios cerca de ti.
            Todos verificados y con catálogo digital.
          </p>

          <div className="search-wrapper">
            <div className="search-field">
              <Search size={16} color="#A0AEC0" />
              <input
                placeholder="¿Qué buscas? (ej: pollería, ropa...)"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
              />
            </div>
            <button className="search-btn">
              <Search size={15} color="white" />
              Buscar
            </button>
          </div>

          <div className="filter-tags">
            {filtros.map((f, i) => (
              <span
                key={i}
                className={`tag ${filtroActivo === f ? 'active' : ''}`}
                onClick={() => setFiltro(f)}
                style={{ cursor: 'pointer' }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        <div className="biz-grid">
          {negociosFiltrados.map((n, i) => (
            <div className="biz-card" key={i} onClick={() => navigate('/tienda/' + n.slug)}>
              <div className="biz-img-wrap">
                <img src={n.img} alt={n.nombre} className="biz-img" />
                <span className="biz-badge-cat">{n.categoria}</span>
                <span className="biz-badge-verified">
                  <ShieldCheck size={12} color="white" /> Verificado
                </span>
              </div>
              <div className="biz-info">
                <div className="biz-name">{n.nombre}</div>
                <div className="biz-rating">
                  <span className="star">⭐</span>
                  {n.rating} ({n.resenas} reseñas)
                </div>
                <div className="biz-address">📍 {n.direccion}</div>
                <button
                  className="biz-quick"
                  onClick={e => { e.stopPropagation(); setNegocioModal(n) }}
                >
                  Vista rápida
                </button>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* NegocioModal recibe el negocio completo (con productos, reviews, whatsapp, etc.) */}
      {negocioModal && (
        <NegocioModal
          negocio={negocioModal}
          onClose={() => setNegocioModal(null)}
        />
      )}
    </>
  )
}

export default Directorio
