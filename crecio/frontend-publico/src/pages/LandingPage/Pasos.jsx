import paso1IMG from '../../assets/IMG-108.png'
import paso2IMG from '../../assets/IMG-126.png'
import paso3IMG from '../../assets/IMG-126.png'
import { Store, ThumbsUp, TrendingUp } from 'lucide-react'
import './Pasos.css'
const pasos = [
  {
    num: '01',
    icon: <Store size={20} color="#00B894" strokeWidth={1.5} />,
    img: paso1IMG,
    titulo: 'Crea tu tienda',
    desc: 'Regístrate en minutos, personaliza tu perfil de negocio y configura tu catálogo con fotos, precios y descripciones. Sin conocimientos técnicos.'
  },
  {
    num: '02',
    icon: <ThumbsUp size={20} color="#00B894" strokeWidth={1.5} />,
    img: paso2IMG,
    titulo: 'La IA trabaja por ti',
    desc: 'Nuestra inteligencia artificial genera descripciones de productos, sugiere precios competitivos y crea campañas de marketing automáticamente.'
  },
  {
    num: '03',
    icon: <TrendingUp size={20} color="#00B894" strokeWidth={1.5} />,
    img: paso3IMG,
    titulo: 'Vende y crece',
    desc: 'Recibe pedidos, gestiona tu inventario y analiza tus ventas desde un panel simple. Tus clientes te encuentran en el buscador local de CRECIO.'
  }
]

function Pasos() {
  return (
    <section className="steps">

      <div className="steps-header">
        <div className="steps-header-left">
          <div className="section-label">El proceso</div>
          <h2 className="section-title">
            Tres pasos para{' '}
            <em style={{ color: 'var(--green)', fontStyle: 'normal' }}>
              digitalizar tu negocio
            </em>
          </h2>
        </div>
        <div className="steps-header-right">
          <p className="section-sub">
            Regístrate en minutos, personaliza tu perfil de negocio y configura
            tu catálogo con fotos, precios y descripciones. Sin conocimientos técnicos.
          </p>
        </div>
      </div>

      <div className="steps-grid">
        {pasos.map((p, i) => (
          <div className="step-card" key={i} style={{ marginTop: i === 1 ? '40px' : '0' }}>
            <div className="step-card-top">
              <span className="step-num-big">{p.num}</span>
              <span className="step-icon-badge">{p.icon}</span>
            </div>
            <div className="step-body">
              <h3>{p.titulo}</h3>
              <p>{p.desc}</p>
            </div>
            <div className="step-img-wrap">
              <img src={p.img} alt={p.titulo} className="step-img" />
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}

export default Pasos