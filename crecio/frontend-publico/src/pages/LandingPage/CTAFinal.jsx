import { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CTAFinal() {
  const navigate = useNavigate()
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [inicio, setInicio] = useState({ nombre: '', email: '', whatsapp: '' })
  // Los datos se pasan al formulario de registro para no escribirlos dos veces
  const empezar = () => navigate('/registro', { state: inicio })

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
      id="registro-rapido"
      className="relative py-24 md:py-32 bg-[#0B0F19] overflow-hidden noise-bg"
    >
      {/* Grid background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
        backgroundSize: '80px 80px'
      }} />

      {/* Glows */}
      <div className="absolute top-20 right-[10%] w-64 h-64 bg-[#0D9488]/5 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-20 left-[5%] w-48 h-48 bg-[#0D9488]/5 rounded-full blur-3xl animate-pulse-glow delay-2000" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-14 lg:gap-20 items-center">

          {/* Izquierda — contenido */}
          <div className={`flex-1 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="inline-flex items-center rounded-full bg-[#0D9488]/20 border border-[#0D9488]/30 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0D9488] mb-4">
              Empieza hoy
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold text-white leading-[1.1] mb-5 tracking-tight">
              Tu negocio
              <br />
              <span className="gradient-teal">te espera.</span>
            </h2>
            <p className="mt-4 text-sm md:text-base text-white/60 leading-relaxed mb-10 max-w-md">
              Hoy muchos clientes buscan en internet antes de visitar un negocio. Con CRECIO tu negocio aparece con catálogo, precios, horarios y todo lo que necesitan para decidir.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-10">
              {[
                { number: '5 min',  label: 'Para crear tu perfil'       },
                { number: '24/7',   label: 'Disponible para clientes'   },
                { number: 'S/ 0',   label: 'Para empezar'               },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl md:text-3xl font-bold text-[#0D9488]">{s.number}</div>
                  <div className="text-xs text-[#6B7280] mt-1 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="flex flex-col gap-3 text-sm">
              {[
                'Perfil profesional con tu logo y fotos',
                'Catálogo digital interactivo',
                'Botón de WhatsApp para pedidos directos',
                'Apareces en el directorio de tiendas de CRECIO',
                'IA para redactar y publicar en Facebook e Instagram',
              ].map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 flex items-center justify-center shrink-0 rounded-full bg-[#0D9488]/10">
                    <i className="ri-check-line text-[#0D9488] text-xs" />
                  </div>
                  <span className="text-[#D1D5DB]">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Derecha — card CTA */}
          <div className={`flex-1 max-w-md w-full transition-all duration-1000 delay-200 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            <div className="relative bg-[#111827]/80 backdrop-blur-xl rounded-2xl p-8 md:p-10 border border-[#1F2937] spotlight-border">
              <div className="absolute inset-0 rounded-2xl bg-[#0D9488]/5 blur-xl -z-10" />

              <div className="text-center mb-7">
                <h3 className="text-xl font-bold text-white mb-2">
                  Crea la tienda de tu negocio
                </h3>
                <p className="text-sm text-[#9CA3AF]">
                  Escribe estos datos y continúa tu registro. Es gratis y toma unos minutos.
                </p>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Nombre de tu negocio"
                  value={inicio.nombre}
                  onChange={(e) => setInicio({ ...inicio, nombre: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#1F2937] border border-[#374151] text-sm text-white placeholder-[#6B7280] focus:outline-none focus:border-[#0D9488] transition-colors"
                />
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  value={inicio.email}
                  onChange={(e) => setInicio({ ...inicio, email: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#1F2937] border border-[#374151] text-sm text-white placeholder-[#6B7280] focus:outline-none focus:border-[#0D9488] transition-colors"
                />
                <input
                  type="tel"
                  placeholder="Número de WhatsApp"
                  value={inicio.whatsapp}
                  onChange={(e) => setInicio({ ...inicio, whatsapp: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#1F2937] border border-[#374151] text-sm text-white placeholder-[#6B7280] focus:outline-none focus:border-[#0D9488] transition-colors"
                />
                <button
                  onClick={empezar}
                  className="w-full py-3.5 rounded-xl bg-[#0D9488] text-white font-semibold text-sm hover:bg-[#0F766E] transition-all cursor-pointer shadow-lg shadow-[#0D9488]/20 hover:shadow-[#0D9488]/30 hover:scale-[1.02]"
                >
                  Continuar con mi registro
                </button>
              </div>

              <p className="text-center text-xs text-[#6B7280] mt-4">
                Sin tarjeta de crédito. Puedes empezar con el plan gratuito.
              </p>

              <div className="border-t border-[#1F2937] pt-4 mt-4 text-center">
                <p className="text-xs text-[#9CA3AF]">
                  ¿Prefieres hacerlo tú mismo?{' '}
                  <button
                    onClick={() => navigate('/registro')}
                    className="text-[#0D9488] font-semibold hover:underline cursor-pointer"
                  >
                    Crear mi tienda ahora
                  </button>
                </p>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-5 mt-6 text-xs text-[#6B7280]">
              {[
                { icon: 'ri-shield-check-line', label: 'Datos seguros'   },
                { icon: 'ri-time-line',          label: 'Respuesta en 24h'},
                { icon: 'ri-sparkling-line',     label: 'Sin costo'       },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-1.5">
                  <i className={`${b.icon} text-[#0D9488]`} />
                  {b.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTAFinal