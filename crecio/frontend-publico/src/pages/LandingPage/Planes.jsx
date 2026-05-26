import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const planes = [
  {
    nombre: 'Basico',
    precio: { mensual: 0, anual: 0 },
    descripcion: 'Para empezar a digitalizarte sin costo.',
    features: [
      'Catálogo con hasta 20 productos',
      'Panel de administración básico',
      'Perfil en buscador local',
      'Soporte por email',
      '1 usuario administrador',
    ],
    noFeatures: ['Herramientas de IA', 'Dominio personalizado', 'Reportes avanzados'],
    cta: 'Empezar Gratis',
    popular: false,
  },
  {
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
      'Hasta 3 usuarios',
    ],
    noFeatures: [],
    cta: 'Empezar Prueba Gratis',
    popular: true,
  },
  {
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
  },
]

function Planes() {
  const navigate = useNavigate()
  const [anual, setAnual] = useState(false)
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="precios"
      className="relative py-24 md:py-32 bg-[#0B0F19] overflow-hidden noise-bg"
    >
      {/* Grid background sutil */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#0D9488] mb-4">
            Planes y Precios
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-5 tracking-tight">
            Crece a tu
            <br />
            <span className="gradient-teal">ritmo</span>
          </h2>
          <p className="text-[#9CA3AF] max-w-md mx-auto text-sm md:text-base">
            Empieza gratis y escala cuando estés listo. Sin sorpresas ni costos ocultos.
          </p>

          {/* Toggle — igual al ref: switch deslizante */}
          <div className="flex items-center justify-center gap-3 mt-10">
            <span className={`text-sm font-medium transition-colors ${!anual ? 'text-white' : 'text-[#6B7280]'}`}>
              Mensual
            </span>
            <button
              onClick={() => setAnual(!anual)}
              className={`relative w-14 h-7 rounded-full transition-colors cursor-pointer ${anual ? 'bg-[#0D9488]' : 'bg-[#374151]'}`}
            >
              <span
                className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${anual ? 'left-8' : 'left-1'}`}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${anual ? 'text-white' : 'text-[#6B7280]'}`}>
              Anual
            </span>
            {anual && (
              <span className="bg-[#0D9488]/20 text-[#0D9488] text-xs px-2 py-1 rounded font-semibold animate-pulse-glow">
                Ahorra 20%
              </span>
            )}
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-start">
          {planes.map((plan, idx) => (
            <div
              key={plan.nombre}
              className={`relative group transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${200 + idx * 150}ms` }}
            >
              {/* Badge popular */}
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
                {/* Glow popular */}
                {plan.popular && (
                  <div className="absolute inset-0 rounded-2xl bg-[#0D9488]/5 blur-xl -z-10 group-hover:bg-[#0D9488]/10 transition-all duration-500" />
                )}

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
                  <p className="text-[#9CA3AF] text-sm mt-2">{plan.descripcion}</p>
                </div>

                {/* CTA */}
                <button
                  onClick={() => navigate('/registro')}
                  className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                    plan.popular
                      ? 'bg-[#0D9488] text-white hover:bg-[#0F766E] shadow-lg shadow-[#0D9488]/20 hover:shadow-[#0D9488]/30 hover:scale-[1.02]'
                      : plan.precio.mensual === 0
                      ? 'border border-[#374151] text-white hover:border-[#0D9488] hover:text-[#0D9488]'
                      : 'border border-[#374151] text-white hover:bg-[#1F2937]'
                  }`}
                >
                  {plan.cta}
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
          Todos los planes incluyen 14 días de prueba gratis. Sin tarjeta de crédito requerida.
        </p>
      </div>
    </section>
  )
}

export default Planes