import { useState, useEffect } from 'react'
import { Search, MapPin, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import NegocioModal from './NegocioModal'
import { getNegocios } from '../../services/apiPublico'
import './Directorio.css'

const filtros = ['Todos', 'Restaurante', 'Moda', 'Ferreteria', 'Panaderia', 'Tecnologia', 'Flores']

function Directorio() {
  const navigate = useNavigate()
  const [negocios, setNegocios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [filtroActivo, setFiltroActivo] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')
  const [negocioSeleccionado, setNegocioSeleccionado] = useState(null)

  useEffect(() => {
    getNegocios()
      .then(data => {
        setNegocios(data)
        setCargando(false)
      })
      .catch(err => {
        console.error(err)
        setCargando(false)
      })
  }, [])

  const negociosFiltrados = negocios.filter(n => {
    const porCategoria = filtroActivo === 'Todos' || n.categoria === filtroActivo
    const porBusqueda = n.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return porCategoria && porBusqueda
  })

  return (
    <section className="directory">
      <div className="directory-header">
        <div className="section-label" style={{ textAlign: 'center' }}>Directorio</div>
        <h2 className="section-title" style={{ textAlign: 'center' }}>
          Descubre negocios{' '}
          <em style={{ color: 'var(--green)', fontStyle: 'normal' }}>en tu localidad</em>
        </h2>
        <p className="directory-sub">
          Encuentra tiendas, restaurantes y servicios cerca de ti. Todos verificados y con catalogo digital.
        </p>

        <div className="search-wrapper">
          <div className="search-field">
            <Search size={16} color="#A0AEC0" />
            <input
              placeholder="Que buscas? (ej: polleria, ropa...)"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>
          <div className="search-divider" />
          <div className="search-field">
            <MapPin size={16} color="#A0AEC0" />
            <input placeholder="Ubicacion" />
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
              className={filtroActivo === f ? 'tag active' : 'tag'}
              onClick={() => setFiltroActivo(f)}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {cargando ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gray-3)', fontSize: '15px' }}>
          Cargando negocios...
        </div>
      ) : (
        <div className="biz-grid">
          {negociosFiltrados.map((n, i) => (
            <div className="biz-card" key={i}>
              <div className="biz-img-wrap">
                <img src={n.img} alt={n.nombre} className="biz-img" />
                <span className="biz-badge-cat">{n.categoria}</span>
                {n.verificado && (
                  <span className="biz-badge-verified">
                    <ShieldCheck size={12} color="white" />
                    Verificado
                  </span>
                )}
              </div>
              <div className="biz-info">
                <div className="biz-name">{n.nombre}</div>
                <div className="biz-rating">★ {n.rating} ({n.resenas} resenas)</div>
                <div className="biz-meta">
                  <div className="biz-address">📍 {n.direccion}</div>
                  <div className="biz-cta" onClick={() => navigate('/tienda/' + n.id)}>
                    Ver pagina →
                  </div>
                </div>
                <button className="biz-quick" onClick={() => setNegocioSeleccionado(n)}>
                  Vista rapida
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {negocioSeleccionado && (
        <NegocioModal
          negocio={negocioSeleccionado}
          onClose={() => setNegocioSeleccionado(null)}
        />
      )}
    </section>
  )
}

export default Directorio