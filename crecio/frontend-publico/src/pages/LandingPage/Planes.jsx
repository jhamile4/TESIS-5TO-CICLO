import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const planes = [
  {
    id: 'gratis',
    nombre: 'Básico',
    precio: { mensual: 0, anual: 0 },
    descripcion: 'Para empezar a digitalizarte sin costo.',
    features: [
      'Catálogo con hasta 20 productos',
      'Panel de administración básico',
      'Perfil en buscador local',
      'Soporte por email',
    ],
    noFeatures: ['Herramientas de IA', 'Dominio personalizado', 'Reportes avanzados'],
    cta: 'Empezar Gratis',
    popular: false,
    accion: 'registro',
  },
  {
    id: 'pro',
    nombre: 'CRECIO Pro',
    precio: { mensual: 49, anual: 39 },
    descripcion: 'El plan favorito de los negocios que quieren crecer.',
    features: [
      'Catálogo ilimitado de productos',
      'Panel de administración completo',
      'Herramientas de IA incluidas',
      'Dominio personalizado',
      'Reportes y analíticas avanzadas',
      'Soporte prioritario 24/7',
    ],
    noFeatures: [],
    cta: 'Empezar Prueba Gratis',
    popular: true,
    accion: 'pagar',
  },
  {
    id: 'enterprise',
    nombre: 'Empresarial',
    precio: { mensual: 129, anual: 99 },
    descripcion: 'Para negocios con múltiples sucursales.',
    features: [
      'Todo lo de Pro',
      'Múltiples sucursales',
      'API personalizada',
      'Usuarios ilimitados',
      'Onboarding dedicado',
      'SLA garantizado',
    ],
    noFeatures: [],
    cta: 'Contactar Ventas',
    popular: false,
    accion: 'whatsapp',
  },
]

function Planes() {
  const navigate   = useNavigate()
  const [anual, setAnual]     = useState(false)
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  const handleCTA = (plan) => {
    const token = localStorage.getItem('token_comprador')
    const periodo = anual ? 'anual' : 'mensual'

    if (plan.accion === 'registro') {
      navigate('/registro')
    } else if (plan.accion === 'pagar') {
      if (!token) {
        // No logueado → ir a login primero
        navigate(`/login?redirect=/pagar-plan?plan=${plan.id}%26periodo=${periodo}`)
      } else {
        navigate(`/pagar-plan?plan=${plan.id}&periodo=${periodo}`)
      }
    } else if (plan.accion === 'whatsapp') {
      window.open(
        `https://wa.me/51987654321?text=${encodeURIComponent('Hola CRECIO, me interesa el plan Empresarial para mi negocio. ¿Podemos hablar?')}`,
        '_blank'
      )
    }
  }

  const ctaStyle = (plan) => {
    if (plan.popular) return 'bg-[#0D9488] text-white hover:bg-[#0F766E] shadow-lg shadow-[#0D9488]/20'
    if (plan.id === 'enterprise') return 'border border-white/20 text-white hover:bg-white/5'
    return 'border border-white/20 text-white hover:bg-white/5'
  }

  return (
    <section
      ref={sectionRef}
      id="precios"
      className="relative py-24 md:py-32 bg-[#0B0F19] overflow-hidden"
    >
      {/* Grid bg */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-flex items-center rounded-full bg-[#0D9488]/20 border border-[#0D9488]/30 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0D9488] mb-4">
            Planes y Precios
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold text-white leading-[1.1] tracking-tight">
            Crece a tu
            <br />
            <span className="gradient-teal">ritmo</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base text-white/60 leading-relaxed mb-10">
            Empieza gratis y escala cuando estés listo. Sin sorpresas ni costos ocultos.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className={`text-sm font-medium transition-colors ${!anual ? 'text-white' : 'text-[#6B7280]'}`}>Mensual</span>
            <button
              onClick={() => setAnual(!anual)}
              className={`relative w-14 h-7 rounded-full transition-colors cursor-pointer ${anual ? 'bg-[#0D9488]' : 'bg-[#374151]'}`}
            >
              <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${anual ? 'left-8' : 'left-1'}`} />
            </button>
            <span className={`text-sm font-medium transition-colors ${anual ? 'text-white' : 'text-[#6B7280]'}`}>Anual</span>
            {anual && (
              <span className="bg-[#0D9488]/20 text-[#0D9488] text-xs px-2 py-1 rounded font-semibold">
                Ahorra 20%
              </span>
            )}
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-start">
          {planes.map((plan, idx) => (
            <div
              key={plan.id}
              className={`relative group transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${200 + idx * 150}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                  <span className="bg-[#0D9488] text-white text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap shadow-lg shadow-[#0D9488]/20">
                    Recomendado
                  </span>
                </div>
              )}

              <div
                className={`relative rounded-2xl p-7 md:p-8 flex flex-col gap-6 h-full transition-all duration-500 ${
                  plan.popular
                    ? 'bg-gradient-to-b from-[#0D9488]/10 to-transparent border border-[#0D9488]/30 spotlight-border'
                    : 'glass-card hover:border-[#0D9488]/20'
                }`}
                style={{ transform: plan.popular ? 'translateY(-8px)' : 'translateY(0)' }}
              >
                {/* Nombre y precio */}
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                    {plan.nombre}
                  </span>
                  <div className="flex items-baseline gap-1 mt-3">
                    <span className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                      {plan.precio.mensual === 0
                        ? 'Gratis'
                        : `S/ ${anual ? plan.precio.anual : plan.precio.mensual}`}
                    </span>
                    {plan.precio.mensual > 0 && (
                      <span className="text-[#6B7280] text-sm">/mes</span>
                    )}
                  </div>
                  {anual && plan.precio.mensual > 0 && (
                    <p className="text-xs text-[#0D9488] font-medium mt-1">
                      Ahorras S/ {(plan.precio.mensual - plan.precio.anual) * 12} al año
                    </p>
                  )}
                  <p className="text-[#9CA3AF] text-sm mt-2">{plan.descripcion}</p>
                </div>

                {/* CTA */}
                <button
                  onClick={() => handleCTA(plan)}
                  className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${ctaStyle(plan)}`}
                >
                  {plan.id === 'enterprise'
                    ? <span className="flex items-center justify-center gap-2">
                        <i className="ri-whatsapp-line" /> {plan.cta}
                      </span>
                    : plan.cta
                  }
                </button>

                {/* Features */}
                <div className="flex flex-col gap-3">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-3">
                      <div className="w-5 h-5 flex items-center justify-center mt-0.5 shrink-0 rounded-full bg-[#0D9488]/10">
                        <i className="ri-check-line text-[#0D9488] text-xs" />
                      </div>
                      <span className="text-[#D1D5DB] text-sm">{f}</span>
                    </div>
                  ))}
                  {plan.noFeatures.map((f) => (
                    <div key={f} className="flex items-start gap-3 opacity-30">
                      <div className="w-5 h-5 flex items-center justify-center mt-0.5 shrink-0">
                        <i className="ri-close-line text-[#6B7280] text-xs" />
                      </div>
                      <span className="text-[#6B7280] text-sm line-through">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[#6B7280]/60 text-xs text-center mt-10">
          Todos los planes incluyen 14 días de prueba gratis. Sin tarjeta de crédito requerida para el plan Básico.
        </p>
      </div>
    </section>
  )
}

export default Planes