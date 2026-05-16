import { Check, X } from 'lucide-react'
import './Planes.css'

const planes = [
  {
    tipo: 'BÁSICO',
    nombre: 'Gratis',
    precio: null,
    desc: 'Para empezar a digitalizarte sin costo.',
    cta: 'Empezar Gratis',
    ctaEstilo: 'outline',
    featured: false,
    features: [
      { texto: 'Catálogo con hasta 20 productos', activo: true },
      { texto: 'Panel de administración básico', activo: true },
      { texto: 'Perfil en buscador local', activo: true },
      { texto: 'Soporte por email', activo: true },
      { texto: '1 usuario administrador', activo: true },
      { texto: 'Herramientas de IA', activo: false },
      { texto: 'Dominio personalizado', activo: false },
      { texto: 'Reportes avanzados', activo: false },
    ]
  },
  {
    tipo: 'CRECIO PRO',
    nombre: 'S/ 49',
    precio: '/mes',
    desc: 'El plan favorito de los negocios que quieren crecer.',
    cta: 'Empezar Prueba Gratis',
    ctaEstilo: 'solid',
    featured: true,
    badge: 'MÁS POPULAR',
    features: [
      { texto: 'Catálogo ilimitado de productos', activo: true },
      { texto: 'Panel de administración completo', activo: true },
      { texto: 'Herramientas de IA incluidas', activo: true },
      { texto: 'Dominio personalizado', activo: true },
      { texto: 'Reportes y analíticas avanzadas', activo: true },
      { texto: 'Soporte prioritario 24/7', activo: true },
      { texto: 'Hasta 3 usuarios', activo: true },
    ]
  },
  {
    tipo: 'EMPRESARIAL',
    nombre: 'S/ 129',
    precio: '/mes',
    desc: 'Para negocios con múltiples sucursales.',
    cta: 'Contactar Ventas',
    ctaEstilo: 'outline',
    featured: false,
    features: [
      { texto: 'Todo lo de Pro', activo: true },
      { texto: 'Múltiples sucursales', activo: true },
      { texto: 'API personalizada', activo: true },
      { texto: 'Usuarios ilimitados', activo: true },
      { texto: 'Onboarding dedicado', activo: true },
      { texto: 'SLA garantizado', activo: true },
    ]
  }
]

function Planes() {
  return (
    <section className="plans">
      <div className="plans-inner">

        <div className="plans-header">
          <h2 className="plans-title">
            Planes para cada etapa<br />
            <em>de tu negocio</em>
          </h2>
          <p className="plans-sub">
            Empieza gratis y escala cuando estés listo. Sin sorpresas ni costos ocultos.
          </p>
          <div className="plans-toggle">
            <span className="toggle-label">Mensual</span>
            <div className="toggle">
              <div className="toggle-thumb"></div>
            </div>
            <span className="toggle-label">Anual</span>
            <span className="discount-badge">Ahorra 20%</span>
          </div>
        </div>

        <div className="plans-grid">
          {planes.map((p, i) => (
            <div className={`plan-card ${p.featured ? 'featured' : ''}`} key={i}>
              {p.badge && <div className="plan-badge">{p.badge}</div>}
              <div className="plan-tipo">{p.tipo}</div>
              <div className="plan-nombre">{p.nombre}
                {p.precio && <span className="plan-periodo">{p.precio}</span>}
              </div>
              <p className="plan-desc">{p.desc}</p>
              <button className={`plan-cta ${p.ctaEstilo}`}>{p.cta}</button>
              <div className="plan-features">
                {p.features.map((f, j) => (
                  <div className={`plan-feature ${!f.activo ? 'inactive' : ''}`} key={j}>
                    {f.activo
                      ? <Check size={15} color="#00B894" strokeWidth={2.5} />
                      : <X size={15} color="#CBD5E0" strokeWidth={2} />
                    }
                    <span>{f.texto}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="plans-note">
          Todos los planes incluyen 14 días de prueba gratis. Sin tarjeta de crédito requerida.
        </p>

      </div>
    </section>
  )
}

export default Planes