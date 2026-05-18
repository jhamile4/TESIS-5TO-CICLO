import { useState } from 'react'
import { Check, X, ArrowRight, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './Planes.css'

const planes = [
  {
    tipo: 'BÁSICO',
    precioMensual: null,
    precioAnual: null,
    desc: 'Para empezar a digitalizarte sin costo.',
    cta: 'Empezar Gratis',
    ctaRuta: '/registro',
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
    precioMensual: 49,
    precioAnual: 39,
    desc: 'El plan favorito de los negocios que quieren crecer.',
    cta: 'Empezar Prueba Gratis',
    ctaRuta: '/registro',
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
    precioMensual: 129,
    precioAnual: 103,
    desc: 'Para negocios con múltiples sucursales.',
    cta: 'Contactar Ventas',
    ctaRuta: '/registro',
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
  const navigate = useNavigate()
  const [anual, setAnual] = useState(false)
  const [planActivo, setPlanActivo] = useState(null)

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
            <span
              className={`toggle-label ${!anual ? 'activo' : ''}`}
              onClick={() => setAnual(false)}
            >
              Mensual
            </span>
            <button
              className={`toggle ${anual ? 'on' : ''}`}
              onClick={() => setAnual(v => !v)}
              aria-label="Cambiar periodo de facturación"
            >
              <div className="toggle-thumb" />
            </button>
            <span
              className={`toggle-label ${anual ? 'activo' : ''}`}
              onClick={() => setAnual(true)}
            >
              Anual
            </span>
            <span className={`discount-badge ${anual ? 'resaltado' : ''}`}>
              <Zap size={11} style={{ display: 'inline', marginRight: 3, verticalAlign: 'middle' }} />
              Ahorra 20%
            </span>
          </div>
        </div>

        <div className="plans-grid">
          {planes.map((p, i) => {
            const precio = anual ? p.precioAnual : p.precioMensual
            const estaActivo = planActivo === i

            return (
              <div
                className={`plan-card ${p.featured ? 'featured' : ''} ${estaActivo ? 'seleccionado' : ''}`}
                key={i}
                onClick={() => setPlanActivo(i === planActivo ? null : i)}
              >
                {p.badge && <div className="plan-badge">{p.badge}</div>}
                {estaActivo && <div className="plan-seleccionado-tag">Seleccionado ✓</div>}

                <div className="plan-tipo">{p.tipo}</div>

                <div className="plan-nombre">
                  {precio !== null ? (
                    <>
                      <span className="plan-precio-val" key={`${precio}-${anual}`}>
                        S/ {precio}
                      </span>
                      <span className="plan-periodo">/mes</span>
                    </>
                  ) : (
                    <span className="plan-precio-val" key="gratis">Gratis</span>
                  )}
                </div>

                {precio !== null && anual && (
                  <div className="plan-facturado" key={`fact-${precio}`}>
                    Facturado S/ {precio * 12} al año
                  </div>
                )}

                <p className="plan-desc">{p.desc}</p>

                <button
                  className={`plan-cta ${p.ctaEstilo}`}
                  onClick={e => { e.stopPropagation(); navigate(p.ctaRuta) }}
                >
                  {p.cta}
                  <ArrowRight size={14} style={{ display: 'inline', marginLeft: 6, verticalAlign: 'middle' }} />
                </button>

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
            )
          })}
        </div>

        <p className="plans-note">
          Todos los planes incluyen 14 días de prueba gratis. Sin tarjeta de crédito requerida.
        </p>

      </div>
    </section>
  )
}

export default Planes
