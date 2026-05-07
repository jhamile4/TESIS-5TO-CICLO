import { Search, MapPin, ShieldCheck } from 'lucide-react'
import polleriaIMG from '../../assets/IMG-170.png'
import boutiqueIMG from '../../assets/IMG-210.png'
import ferreteriaIMG from '../../assets/IMG-250.png'
import panaderiaIMG from '../../assets/IMG-284.png'
import barberiaIMG from '../../assets/IMG-324.png'
import floreriaIMG from '../../assets/IMG-364.png'
import './Directorio.css'
const negocios = [
  { img: polleriaIMG, nombre: 'Pollería El Sabor', categoria: 'Restaurante', rating: '4.8', resenas: '234', direccion: 'Jr. Lima 342, Miraflores' },
  { img: boutiqueIMG, nombre: 'Boutique Valentina', categoria: 'Moda', rating: '4.9', resenas: '89', direccion: 'Av. Larco 1205, Miraflores' },
  { img: ferreteriaIMG, nombre: 'Ferretería Don Carlos', categoria: 'Ferretería', rating: '4.7', resenas: '156', direccion: 'Calle Los Pinos 78, San Isidro' },
  { img: panaderiaIMG, nombre: 'Panadería La Tradición', categoria: 'Panadería', rating: '4.6', resenas: '98', direccion: 'Jr. Cusco 45, Barranco' },
  { img: barberiaIMG, nombre: 'Sant Royal Perú', categoria: 'Tecnología', rating: '4.7', resenas: '201', direccion: 'Av. Brasil 890, Pueblo Libre' },
  { img: floreriaIMG, nombre: 'Florería Primavera', categoria: 'Flores', rating: '5.0', resenas: '312', direccion: 'Calle Las Rosas 12, Surco' },
]

const filtros = ['Todos', 'Restaurante', 'Moda', 'Ferretería', 'Panadería', 'Tecnología', 'Flores']

function Directorio() {
  return (
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
            <input placeholder="¿Qué buscas? (ej: pollería, ropa...)" />
          </div>
          <div className="search-divider" />
          <div className="search-field">
            <MapPin size={16} color="#A0AEC0" />
            <input placeholder="Ubicación" />
          </div>
          <button className="search-btn">
            <Search size={15} color="white" />
            Buscar
          </button>
        </div>

        <div className="filter-tags">
          {filtros.map((f, i) => (
            <span key={i} className={`tag ${i === 0 ? 'active' : ''}`}>{f}</span>
          ))}
        </div>
      </div>

      <div className="biz-grid">
        {negocios.map((n, i) => (
          <div className="biz-card" key={i}>
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
              <div className="biz-meta">
                <div className="biz-address">📍 {n.direccion}</div>
                <div className="biz-cta">Ver página →</div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}

export default Directorio