import { useState } from 'react'
import { Search, MapPin, ShieldCheck, X, MessageCircle, Clock, Phone } from 'lucide-react'
import polleriaIMG from '../../assets/IMG-170.png'
import boutiqueIMG from '../../assets/IMG-210.png'
import ferreteriaIMG from '../../assets/IMG-250.png'
import panaderiaIMG from '../../assets/IMG-284.png'
import barberiaIMG from '../../assets/IMG-324.png'
import floreriaIMG from '../../assets/IMG-364.png'
import './Directorio.css'

const negocios = [
  {
    img: polleriaIMG,
    nombre: 'Pollería El Sabor',
    categoria: 'Restaurante',
    rating: '4.8',
    resenas: '234',
    direccion: 'Jr. Lima 342, Miraflores',
    horario: 'Lun-Dom: 12:00 pm - 10:00 pm',
    telefono: '999 123 456',
    desc: 'La mejor pollería del barrio con más de 15 años de experiencia. Pollo a la brasa al carbón, jugoso y crocante. ¡Delivery disponible!',
    productos: [
      { nombre: 'Pollo a la brasa 1/4', desc: '1/4 de pollo jugoso con papas fritas, ensalada y salsas', precio: 28 },
      { nombre: 'Pollo a la brasa 1/2', desc: '1/2 pollo para compartir con papas, arroz chaufa y ensalada', precio: 48 },
      { nombre: 'Pollo entero + papas', desc: 'Pollo entero con 2 porciones de papas, arroz y ensalada', precio: 82 },
      { nombre: 'Anticuchos de corazón', desc: '4 brochetas de corazón con papa y salsa de rocoto', precio: 18 },
    ]
  },
  {
    img: boutiqueIMG,
    nombre: 'Boutique Valentina',
    categoria: 'Moda',
    rating: '4.9',
    resenas: '89',
    direccion: 'Av. Larco 1205, Miraflores',
    horario: 'Lun-Sáb: 10:00 am - 8:00 pm',
    telefono: '999 234 567',
    desc: 'Moda femenina exclusiva con las últimas tendencias. Ropa, accesorios y calzado para toda ocasión.',
    productos: [
      { nombre: 'Blusa floral', desc: 'Blusa de algodón con estampado floral, tallas S-XL', precio: 45 },
      { nombre: 'Jeans tiro alto', desc: 'Jean de mezclilla stretch, corte recto', precio: 89 },
      { nombre: 'Vestido casual', desc: 'Vestido midi de lino para el día a día', precio: 120 },
    ]
  },
  {
    img: ferreteriaIMG,
    nombre: 'Ferretería Don Carlos',
    categoria: 'Ferretería',
    rating: '4.7',
    resenas: '156',
    direccion: 'Calle Los Pinos 78, San Isidro',
    horario: 'Lun-Sáb: 8:00 am - 6:00 pm',
    telefono: '999 345 678',
    desc: 'Todo en herramientas, materiales de construcción y artículos del hogar. Más de 20 años sirviendo al barrio.',
    productos: [
      { nombre: 'Taladro eléctrico', desc: 'Taladro 750W con accesorios incluidos', precio: 180 },
      { nombre: 'Pintura látex blanca', desc: 'Balde 4 litros, rendimiento 40m²', precio: 65 },
      { nombre: 'Juego de llaves', desc: 'Set 12 llaves combinadas de acero', precio: 45 },
    ]
  },
  {
    img: panaderiaIMG,
    nombre: 'Panadería La Tradición',
    categoria: 'Panadería',
    rating: '4.6',
    resenas: '98',
    direccion: 'Jr. Cusco 45, Barranco',
    horario: 'Lun-Dom: 6:00 am - 9:00 pm',
    telefono: '999 456 789',
    desc: 'Pan artesanal horneado cada mañana con recetas tradicionales de más de 30 años.',
    productos: [
      { nombre: 'Pan francés', desc: 'Docena de pan francés recién horneado', precio: 6 },
      { nombre: 'Torta de chocolate', desc: 'Torta entera de 1kg con cobertura de chocolate', precio: 55 },
      { nombre: 'Empanadas', desc: '6 empanadas de carne o pollo al horno', precio: 18 },
    ]
  },
  {
    img: barberiaIMG,
    nombre: 'Sant Royal Perú',
    categoria: 'Tecnología',
    rating: '4.7',
    resenas: '201',
    direccion: 'Av. Brasil 890, Pueblo Libre',
    horario: 'Lun-Sáb: 9:00 am - 7:00 pm',
    telefono: '999 567 890',
    desc: 'Especialistas en equipos tecnológicos, accesorios y reparación de celulares y laptops.',
    productos: [
      { nombre: 'Audífonos Bluetooth', desc: 'Audífonos inalámbricos con cancelación de ruido', precio: 120 },
      { nombre: 'Cargador rápido', desc: 'Cargador 65W compatible con todos los celulares', precio: 35 },
      { nombre: 'Funda para celular', desc: 'Funda silicona premium para iPhone y Samsung', precio: 15 },
    ]
  },
  {
    img: floreriaIMG,
    nombre: 'Florería Primavera',
    categoria: 'Flores',
    rating: '5.0',
    resenas: '312',
    direccion: 'Calle Las Rosas 12, Surco',
    horario: 'Lun-Dom: 8:00 am - 8:00 pm',
    telefono: '999 678 901',
    desc: 'Arreglos florales para toda ocasión. Flores frescas importadas y nacionales. Delivery el mismo día.',
    productos: [
      { nombre: 'Ramo de rosas rojas', desc: 'Docena de rosas rojas con lazo y tarjeta', precio: 65 },
      { nombre: 'Arreglo primaveral', desc: 'Mix de flores de temporada en florero de vidrio', precio: 85 },
      { nombre: 'Bouquet de bodas', desc: 'Ramo personalizado para novias, cotizar diseño', precio: 150 },
    ]
  },
]

const filtros = ['Todos', 'Restaurante', 'Moda', 'Ferretería', 'Panadería', 'Tecnología', 'Flores']

function Directorio() {
  const [negocioSeleccionado, setNegocioSeleccionado] = useState(null)
  const [tabActivo, setTabActivo] = useState('productos')

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
                ⭐ {n.rating} ({n.resenas} reseñas)
              </div>
              <div className="biz-meta">
                <div className="biz-address">📍 {n.direccion}</div>
                <div className="biz-cta">Ver página →</div>
              </div>
              <button className="biz-quick" onClick={() => { setNegocioSeleccionado(n); setTabActivo('productos') }}>
                👁 Vista rápida
              </button>
            </div>
          </div>
        ))}
      </div>

      {negocioSeleccionado && (
        <div className="modal-overlay" onClick={() => setNegocioSeleccionado(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setNegocioSeleccionado(null)}>
              <X size={18} />
            </button>

            <div className="modal-img-wrap">
              <img src={negocioSeleccionado.img} alt={negocioSeleccionado.nombre} className="modal-img" />
              <span className="modal-verified">
                <ShieldCheck size={13} color="white" /> Verificado CRECIO
              </span>
              <div className="modal-img-badges">
                <span className="biz-badge-cat">{negocioSeleccionado.categoria}</span>
                <span className="modal-rating">⭐ {negocioSeleccionado.rating} ({negocioSeleccionado.resenas})</span>
              </div>
            </div>

            <div className="modal-body">
              <h3 className="modal-nombre">{negocioSeleccionado.nombre}</h3>
              <p className="modal-desc">{negocioSeleccionado.desc}</p>

              <div className="modal-info-row">
                <div className="modal-info-item">
                  <MapPin size={14} color="#00B894" />
                  <div>
                    <div className="modal-info-label">DIRECCIÓN</div>
                    <div className="modal-info-val">{negocioSeleccionado.direccion}</div>
                  </div>
                </div>
                <div className="modal-info-item">
                  <Clock size={14} color="#00B894" />
                  <div>
                    <div className="modal-info-label">HORARIO</div>
                    <div className="modal-info-val">{negocioSeleccionado.horario}</div>
                  </div>
                </div>
                <div className="modal-info-item">
                  <Phone size={14} color="#00B894" />
                  <div>
                    <div className="modal-info-label">TELÉFONO</div>
                    <div className="modal-info-val">{negocioSeleccionado.telefono}</div>
                  </div>
                </div>
              </div>

              <div className="modal-tabs">
                <button className={`modal-tab ${tabActivo === 'productos' ? 'active' : ''}`} onClick={() => setTabActivo('productos')}>
                  Productos ({negocioSeleccionado.productos.length})
                </button>
                <button className={`modal-tab ${tabActivo === 'resenas' ? 'active' : ''}`} onClick={() => setTabActivo('resenas')}>
                  Reseñas ({negocioSeleccionado.resenas})
                </button>
              </div>

              {tabActivo === 'productos' && (
                <div className="modal-productos">
                  {negocioSeleccionado.productos.map((p, i) => (
                    <div className="modal-producto" key={i}>
                      <div className="modal-producto-info">
                        <div className="modal-producto-nombre">{p.nombre}</div>
                        <div className="modal-producto-desc">{p.desc}</div>
                        <div className="modal-producto-whatsapp">
                          <MessageCircle size={13} color="#00B894" />
                          Pedir por WhatsApp
                        </div>
                      </div>
                      <div className="modal-producto-precio">S/ {p.precio}</div>
                    </div>
                  ))}
                </div>
              )}

              {tabActivo === 'resenas' && (
                <div className="modal-resenas">
                  <p style={{ color: 'var(--gray-3)', textAlign: 'center', padding: '2rem' }}>
                    ⭐ {negocioSeleccionado.rating} promedio de {negocioSeleccionado.resenas} reseñas
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </section>
  )
}

export default Directorio