import { useState } from 'react'
import { Search, MapPin, ShieldCheck } from 'lucide-react'
import NegocioModal from './NegocioModal'
import './Directorio.css'

import polleriaIMG from '../../assets/IMG-170.png'
import boutiqueIMG from '../../assets/IMG-210.png'
import ferreteriaIMG from '../../assets/IMG-250.png'
import panaderiaIMG from '../../assets/IMG-284.png'
import barberiaIMG from '../../assets/IMG-324.png'
import floreriaIMG from '../../assets/IMG-364.png'

import t1img1 from '../../assets/tienda1-img1.png.png'
import t1img2 from '../../assets/tienda1-img2.png.png'
import t1img3 from '../../assets/tienda1-img3.png.png'
import t1img4 from '../../assets/tienda1-img4.png.png'
import t2img1 from '../../assets/tienda2-img1.png.png'
import t2img2 from '../../assets/tienda2-img2.png.png'
import t2img3 from '../../assets/tienda2-img3.png.png'
import t2img4 from '../../assets/tienda2-img4.png.png'
import t3img1 from '../../assets/tienda3-img1.png.png'
import t3img2 from '../../assets/tienda3-img2.png.png'
import t3img3 from '../../assets/tienda3-img3.png.png'
import t3img4 from '../../assets/tienda3-img4.png.jpg'
import t4img1 from '../../assets/tienda4-img1.png.png'
import t4img2 from '../../assets/tienda4-img2.png.png'
import t4img3 from '../../assets/tienda4-img3.png.png'
import t4img4 from '../../assets/tienda4-img4.png.jpg'
import t5img1 from '../../assets/tienda5-img1.png.jpg'
import t5img2 from '../../assets/tienda5-img2.png.jpg'
import t5img3 from '../../assets/tienda5-img3.png.jpg'
import t5img4 from '../../assets/tienda5-img4.png.jpg'
import t6img1 from '../../assets/tienda6-img1.png.jpg'
import t6img2 from '../../assets/tienda6-img2.png.jpg'
import t6img3 from '../../assets/tienda6-img3.png.jpg'
import t6img4 from '../../assets/tienda6-img4.png.jpg'

const filtros = ['Todos', 'Restaurante', 'Moda', 'Ferreteria', 'Panaderia', 'Tecnologia', 'Flores']

const negocios = [
  {
    img: polleriaIMG,
    nombre: 'Polleria El Sabor',
    categoria: 'Restaurante',
    rating: '4.8',
    resenas: '234',
    direccion: 'Jr. Lima 342, Miraflores',
    horario: 'Lun-Dom: 12:00 pm - 10:00 pm',
    telefono: '999 123 456',
    whatsapp: '51999123456',
    desc: 'La mejor polleria del barrio con mas de 15 anos de experiencia. Pollo a la brasa al carbon, jugoso y crocante. Delivery disponible.',
    productos: [
      { img: t1img1, nombre: 'Pollo a la brasa 1/4', desc: '1/4 de pollo con papas fritas y salsas', precio: 28 },
      { img: t1img2, nombre: 'Pollo a la brasa 1/2', desc: '1/2 pollo con papas y arroz chaufa', precio: 48 },
      { img: t1img3, nombre: 'Pollo entero mas papas', desc: 'Pollo entero con papas y arroz', precio: 82 },
      { img: t1img4, nombre: 'Anticuchos de corazon', desc: '4 brochetas con papa y salsa de rocoto', precio: 18 },
    ],
    reviews: [
      { nombre: 'Maria Elena R.', tiempo: '2 semanas atras', estrellas: 5, texto: 'El mejor pollo de Miraflores. La piel crocante y la carne jugosa. Delivery llego en 25 minutos.' },
      { nombre: 'Carlos Vasquez', tiempo: '1 mes atras', estrellas: 5, texto: 'Vengo cada domingo con mi familia. Las salsas son increibles especialmente la de aji amarillo.' },
    ]
  },
  {
    img: boutiqueIMG,
    nombre: 'Boutique Valentina',
    categoria: 'Moda',
    rating: '4.9',
    resenas: '89',
    direccion: 'Av. Larco 1205, Miraflores',
    horario: 'Lun-Sab: 10:00 am - 8:00 pm',
    telefono: '999 234 567',
    whatsapp: '51999234567',
    desc: 'Moda femenina exclusiva con las ultimas tendencias. Ropa, accesorios y calzado para toda ocasion.',
    productos: [
      { img: t2img1, nombre: 'Blusa floral', desc: 'Blusa de algodon con estampado floral tallas S-XL', precio: 45 },
      { img: t2img2, nombre: 'Jeans tiro alto', desc: 'Jean de mezclilla stretch corte recto', precio: 89 },
      { img: t2img3, nombre: 'Vestido casual', desc: 'Vestido midi de lino para el dia a dia', precio: 120 },
      { img: t2img4, nombre: 'Cartera de cuero', desc: 'Cartera artesanal de cuero genuino', precio: 75 },
    ],
    reviews: [
      { nombre: 'Ana Torres', tiempo: '1 semana atras', estrellas: 5, texto: 'Encontre el vestido perfecto para mi graduacion. Excelente atencion.' },
      { nombre: 'Sofia Ramos', tiempo: '3 semanas atras', estrellas: 5, texto: 'La mejor boutique de Miraflores. Siempre tienen lo ultimo en moda.' },
    ]
  },
  {
    img: ferreteriaIMG,
    nombre: 'Ferreteria Don Carlos',
    categoria: 'Ferreteria',
    rating: '4.7',
    resenas: '156',
    direccion: 'Calle Los Pinos 78, San Isidro',
    horario: 'Lun-Sab: 8:00 am - 6:00 pm',
    telefono: '999 345 678',
    whatsapp: '51999345678',
    desc: 'Todo en herramientas, materiales de construccion y articulos del hogar. Mas de 20 anos sirviendo al barrio.',
    productos: [
      { img: t3img1, nombre: 'Taladro electrico', desc: 'Taladro 750W con accesorios incluidos', precio: 180 },
      { img: t3img2, nombre: 'Pintura latex blanca', desc: 'Balde 4 litros rendimiento 40m2', precio: 65 },
      { img: t3img3, nombre: 'Juego de llaves', desc: 'Set 12 llaves combinadas de acero', precio: 45 },
      { img: t3img4, nombre: 'Cinta metrica', desc: 'Cinta metrica 5m con freno de seguridad', precio: 12 },
    ],
    reviews: [
      { nombre: 'Pedro Huanca', tiempo: '2 semanas atras', estrellas: 5, texto: 'Don Carlos siempre tiene todo lo que necesito. Precios justos.' },
      { nombre: 'Marco Silva', tiempo: '1 mes atras', estrellas: 4, texto: 'Buena variedad de productos y personal que conoce bien su trabajo.' },
    ]
  },
  {
    img: panaderiaIMG,
    nombre: 'Panaderia La Tradicion',
    categoria: 'Panaderia',
    rating: '4.6',
    resenas: '98',
    direccion: 'Jr. Cusco 45, Barranco',
    horario: 'Lun-Dom: 6:00 am - 9:00 pm',
    telefono: '999 456 789',
    whatsapp: '51999456789',
    desc: 'Pan artesanal horneado cada manana con recetas tradicionales de mas de 30 anos.',
    productos: [
      { img: t4img1, nombre: 'Pan frances', desc: 'Docena de pan frances recien horneado', precio: 6 },
      { img: t4img2, nombre: 'Torta de chocolate', desc: 'Torta entera de 1kg con cobertura de chocolate', precio: 55 },
      { img: t4img3, nombre: 'Empanadas', desc: '6 empanadas de carne o pollo al horno', precio: 18 },
      { img: t4img4, nombre: 'Croissant mantequilla', desc: 'Croissant hojaldrado con mantequilla francesa', precio: 5 },
    ],
    reviews: [
      { nombre: 'Rosa Mendoza', tiempo: '3 dias atras', estrellas: 5, texto: 'El mejor pan del barrio. Lo compro cada manana y siempre esta fresco.' },
      { nombre: 'Jorge Quispe', tiempo: '2 semanas atras', estrellas: 5, texto: 'La torta de chocolate es increible. La pedi para el cumple de mi hijo.' },
    ]
  },
  {
    img: barberiaIMG,
    nombre: 'Sant Royal Peru',
    categoria: 'Tecnologia',
    rating: '4.7',
    resenas: '201',
    direccion: 'Av. Brasil 890, Pueblo Libre',
    horario: 'Lun-Sab: 9:00 am - 7:00 pm',
    telefono: '999 567 890',
    whatsapp: '51999567890',
    desc: 'Especialistas en equipos tecnologicos, accesorios y reparacion de celulares y laptops.',
    productos: [
      { img: t5img1, nombre: 'Audifonos Bluetooth', desc: 'Audifonos inalambricos con cancelacion de ruido', precio: 120 },
      { img: t5img2, nombre: 'Cargador rapido', desc: 'Cargador 65W compatible con todos los celulares', precio: 35 },
      { img: t5img3, nombre: 'Funda para celular', desc: 'Funda silicona premium para iPhone y Samsung', precio: 15 },
      { img: t5img4, nombre: 'Cable USB-C', desc: 'Cable trenzado 2m carga rapida y datos', precio: 18 },
    ],
    reviews: [
      { nombre: 'Luis Garcia', tiempo: '1 semana atras', estrellas: 5, texto: 'Me repararon el celular en 2 horas. Muy profesionales y precio justo.' },
      { nombre: 'Diana Flores', tiempo: '1 mes atras', estrellas: 4, texto: 'Buena atencion y productos originales. Recomendado.' },
    ]
  },
  {
    img: floreriaIMG,
    nombre: 'Floreria Primavera',
    categoria: 'Flores',
    rating: '5.0',
    resenas: '312',
    direccion: 'Calle Las Rosas 12, Surco',
    horario: 'Lun-Dom: 8:00 am - 8:00 pm',
    telefono: '999 678 901',
    whatsapp: '51999678901',
    desc: 'Arreglos florales para toda ocasion. Flores frescas importadas y nacionales. Delivery el mismo dia.',
    productos: [
      { img: t6img1, nombre: 'Ramo de rosas rojas', desc: 'Docena de rosas rojas con lazo y tarjeta', precio: 65 },
      { img: t6img2, nombre: 'Arreglo primaveral', desc: 'Mix de flores de temporada en florero de vidrio', precio: 85 },
      { img: t6img3, nombre: 'Bouquet de bodas', desc: 'Ramo personalizado para novias cotizar diseno', precio: 150 },
      { img: t6img4, nombre: 'Orquideas blancas', desc: 'Maceta de orquideas blancas para regalo', precio: 95 },
    ],
    reviews: [
      { nombre: 'Carmen Lopez', tiempo: '5 dias atras', estrellas: 5, texto: 'Las flores llegaron hermosas y muy frescas. El delivery fue super rapido.' },
      { nombre: 'Patricia Vega', tiempo: '2 semanas atras', estrellas: 5, texto: 'Pedi el bouquet de bodas y quedo perfecto. Muy profesionales.' },
    ]
  },
]

function Directorio() {
  const [negocioSeleccionado, setNegocioSeleccionado] = useState(null)

  return (
    <section className="directory">
      <div className="directory-header">
        <div className="section-label" style={{ textAlign: 'center' }}>Directorio</div>
        <h2 className="section-title" style={{ textAlign: 'center' }}>
          Descubre negocios <em style={{ color: 'var(--green)', fontStyle: 'normal' }}>en tu localidad</em>
        </h2>
        <p className="directory-sub">
          Encuentra tiendas, restaurantes y servicios cerca de ti. Todos verificados y con catalogo digital.
        </p>
        <div className="search-wrapper">
          <div className="search-field">
            <Search size={16} color="#A0AEC0" />
            <input placeholder="Que buscas? (ej: polleria, ropa...)" />
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
            <span key={i} className={i === 0 ? 'tag active' : 'tag'}>{f}</span>
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
                <ShieldCheck size={12} color="white" />
                Verificado
              </span>
            </div>
            <div className="biz-info">
              <div className="biz-name">{n.nombre}</div>
              <div className="biz-rating">★ {n.rating} ({n.resenas} resenas)</div>
              <div className="biz-meta">
                <div className="biz-address">{n.direccion}</div>
                <div className="biz-cta">Ver pagina</div>
              </div>
              <button className="biz-quick" onClick={() => setNegocioSeleccionado(n)}>
                Vista rapida
              </button>
            </div>
          </div>
        ))}
      </div>

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