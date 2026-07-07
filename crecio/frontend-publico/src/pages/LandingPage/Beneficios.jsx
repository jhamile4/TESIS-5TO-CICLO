import { useRef, useEffect, useState } from 'react'

const cards = [
  {
    id: 'tienda',
    icono: 'ri-store-2-line',
    titulo: 'Tienda digital propia',
    descripcion: 'Catálogo completo con fotos, precios y descripción. Tus clientes compran desde el celular sin instalar nada.',
    badge: 'Disponible ya',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    size: 'tall',
    dark: false,
  },
  {
    id: 'ia',
    icono: 'ri-sparkling-2-line',
    titulo: 'IA que trabaja por ti',
    descripcion: 'Genera descripciones, precios y campañas de marketing automáticamente.',
    badge: 'Próximamente',
    size: 'medium',
    dark: true,
  },
  {
    id: 'analytics',
    icono: 'ri-bar-chart-box-line',
    titulo: 'Analítica en tiempo real',
    descripcion: 'Ventas, visitas y conversiones. Todo en un panel simple.',
    badge: null,
    size: 'medium',
    dark: false,
  },
  {
    id: 'google',
    icono: 'ri-search-eye-line',
    titulo: 'Aparece en Google',
    descripcion: 'Tus clientes te encuentran cuando buscan negocios cerca. Posicionamiento local incluido.',
    badge: '+300% visibilidad',
    img: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&q=80',
    size: 'tall',
    dark: true,
  },
  {
    id: 'whatsapp',
    icono: 'ri-whatsapp-line',
    titulo: 'Pedidos directos por WhatsApp',
    descripcion: 'Tus clientes agregan al carrito y el pedido llega directo a tu WhatsApp. Sin apps extra, sin comisiones.',
    badge: null,
    size: 'wide',
    dark: false,
  },
]

const barsData = [
  { day: 'L', value: 35, label: 'S/ 350' },
  { day: 'M', value: 55, label: 'S/ 550' },
  { day: 'X', value: 48, label: 'S/ 480' },
  { day: 'J', value: 72, label: 'S/ 720' },
  { day: 'V', value: 90, label: 'S/ 900' },
  { day: 'S', value: 65, label: 'S/ 650' },
  { day: 'D', value: 85, label: 'S/ 850' }
]

function Beneficios() {
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [hoveredBar, setHoveredBar] = useState(null)
  const [googleVis, setGoogleVis] = useState(0)
  const [chatStep, setChatStep] = useState(0)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (visible) {
      let start = 0
      const end = 300
      const duration = 1200 // ms
      const stepTime = Math.abs(Math.floor(duration / (end / 5)))
      const timer = setInterval(() => {
        start += 5
        if (start >= end) {
          setGoogleVis(end)
          clearInterval(timer)
        } else {
          setGoogleVis(start)
        }
      }, stepTime)
      return () => clearInterval(timer)
    }
  }, [visible])

  useEffect(() => {
    if (visible) {
      const interval = setInterval(() => {
        setChatStep(prev => (prev + 1) % 4)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [visible])

  return (
    <section
      ref={sectionRef}
      id="beneficios"
      className="relative py-24 md:py-32 bg-[#FAFAFA] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-flex items-center rounded-full bg-[#0D9488]/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0D9488] mb-4">
            Para tu negocio
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold text-[#111827] leading-[1.1] tracking-tight">
            Lo que obtienes
            <br />
            <span className="gradient-teal">con CRECIO</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base text-[#4B5563] leading-relaxed">
            Todo lo que un negocio moderno necesita para crecer digitalmente. Sin complicaciones.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">

          {/* CARD 1 — Tienda digital (tall, col-span-1 row-span-2) */}
          <div
            className={`lg:row-span-2 group relative overflow-hidden rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#0D9488]/30 hover:shadow-2xl hover:-translate-y-2 transition-all duration-550 cursor-pointer flex flex-col min-h-[360px] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '100ms' }}
          >
            {/* Imagen de fondo superior */}
            <div className="relative h-56 overflow-hidden shrink-0">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80"
                alt="Tienda digital"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            </div>

            {/* Contenido */}
            <div className="p-7 md:p-8 flex flex-col flex-1">
              <div className="w-12 h-12 flex items-center justify-center bg-[#0D9488]/10 group-hover:bg-[#0D9488]/15 transition-colors rounded-xl mb-5">
                <i className="ri-store-2-line text-[#0D9488] text-xl" />
              </div>
              <h3 className="text-xl font-bold text-[#111827] mb-2">Tienda digital propia</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed flex-1">
                Catálogo completo con fotos, precios y descripción. Tus clientes compran desde el celular sin instalar nada.
              </p>
              <div className="mt-6 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#0D9488]/10 text-[#0D9488] px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] animate-ping" />
                  Disponible ya
                </span>
                <i className="ri-arrow-right-line text-[#0D9488] group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* CARD 2 — IA (dark, medium) */}
          <div
            className={`group relative overflow-hidden rounded-2xl bg-[#0B0F19] border border-[#1F2937] hover:border-[#0D9488]/40 hover:shadow-2xl hover:shadow-[#0D9488]/10 hover:-translate-y-2 transition-all duration-550 cursor-pointer p-7 md:p-8 flex flex-col ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '200ms' }}
          >
            {/* Glow decorativo de fondo */}
            <div className="absolute -right-10 -top-10 w-44 h-44 bg-[#0D9488]/15 rounded-full blur-3xl opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700 pointer-events-none" />

            <div className="w-12 h-12 flex items-center justify-center bg-[#0D9488]/15 group-hover:bg-[#0D9488]/25 transition-colors rounded-xl mb-5 relative z-10">
              <i className="ri-sparkling-2-line text-[#0D9488] text-xl animate-pulse" />
            </div>

            <h3 className="text-lg font-bold text-white mb-2 relative z-10 flex items-center gap-2">
              IA que trabaja por ti
              <span className="text-[9px] font-bold uppercase tracking-wider bg-[#0D9488]/20 text-[#0D9488] px-2 py-0.5 rounded border border-[#0D9488]/30">Beta</span>
            </h3>

            <p className="text-sm text-[#9CA3AF] leading-relaxed flex-1 relative z-10">
              Genera descripciones, precios y campañas de marketing automáticamente. Solo sube una foto.
            </p>

            {/* Tags flotantes */}
            <div className="flex flex-wrap gap-2 mt-5 relative z-10">
              {['Descripciones', 'Precios IA', 'Marketing'].map(t => (
                <span key={t} className="text-[10px] font-semibold bg-white/5 border border-white/10 text-white/70 px-2.5 py-1 rounded-full group-hover:border-[#0D9488]/30 group-hover:bg-[#0D9488]/5 transition-all duration-300">
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-[#0D9488] relative z-10 group-hover:gap-3 transition-all duration-300">
              Próximamente <i className="ri-arrow-right-line" />
            </div>
          </div>

          {/* CARD 3 — Analítica (blanca, medium) */}
          <div
            className={`group relative overflow-hidden rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#0D9488]/30 hover:shadow-2xl hover:-translate-y-2 transition-all duration-550 cursor-pointer p-7 md:p-8 flex flex-col ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="w-12 h-12 flex items-center justify-center bg-[#0D9488]/10 group-hover:bg-[#0D9488]/15 transition-colors rounded-xl mb-5">
              <i className="ri-bar-chart-box-line text-[#0D9488] text-xl" />
            </div>
            <h3 className="text-lg font-bold text-[#111827] mb-2">Analítica en tiempo real</h3>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              Ventas, visitas y conversiones. Todo en un panel simple desde tu celular.
            </p>

            {/* Mini chart con tooltip interactivo */}
            <div className="mt-6 relative flex items-end gap-1.5 h-16">
              {barsData.map((bar, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col justify-end items-center h-full relative"
                  onMouseEnter={() => setHoveredBar(i)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {/* Tooltip */}
                  <div
                    className={`absolute -top-7 left-1/2 -translate-x-1/2 bg-[#111827] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md pointer-events-none transition-all duration-200 ${
                      hoveredBar === i ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-90'
                    }`}
                  >
                    {bar.label}
                  </div>

                  {/* Bar */}
                  <div
                    className="w-full rounded-t transition-all duration-500"
                    style={{
                      height: visible ? `${bar.value}%` : '0%',
                      transitionDelay: visible ? `${400 + i * 50}ms` : '0ms',
                      background: hoveredBar === i
                        ? '#0D9488'
                        : i === 5 || i === 6
                        ? 'linear-gradient(to top, #0D9488, #14B8A6)'
                        : `rgba(13,148,136,${0.15 + i * 0.1})`,
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 border-t border-[#F3F4F6] pt-2">
              {barsData.map((bar, i) => (
                <span key={i} className={`flex-1 text-center text-[10px] font-semibold transition-colors duration-200 ${hoveredBar === i ? 'text-[#0D9488]' : 'text-[#9CA3AF]'}`}>{bar.day}</span>
              ))}
            </div>
          </div>

          {/* CARD 4 — Google (tall dark, col-span-1 row-span-2) */}
          <div
            className={`lg:row-span-2 group relative overflow-hidden rounded-2xl bg-[#0D9488] hover:shadow-2xl hover:shadow-[#0D9488]/30 hover:-translate-y-2 transition-all duration-550 cursor-pointer flex flex-col min-h-[360px] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '400ms' }}
          >
            {/* Imagen de fondo */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&q=80"
                alt="Aparecer en Google"
                className="w-full h-full object-cover opacity-15 group-hover:opacity-25 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D9488] via-[#0D9488]/90 to-[#0D9488]/70" />
            </div>

            {/* Contenido */}
            <div className="relative z-10 p-7 md:p-8 flex flex-col flex-1">
              <div className="w-12 h-12 flex items-center justify-center bg-white/15 group-hover:bg-white/20 transition-colors rounded-xl mb-5">
                <i className="ri-search-eye-line text-white text-xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Aparece en Google</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Tus clientes te encuentran cuando buscan negocios cerca. Posicionamiento local incluido.
              </p>

              {/* Simulación resultado de búsqueda */}
              <div className="mt-6 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-lg group-hover:border-white/30 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <i className="ri-global-line text-white text-[10px]" />
                  </div>
                  <span className="text-[10px] text-white/60 font-medium">google.com › maps</span>
                </div>
                <p className="text-xs font-semibold text-[#5EEAD4] mb-0.5">Tu negocio · Lima, Perú</p>
                <p className="text-[10px] text-white/50 mb-2">Abierto ahora · Ver más</p>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(s => <i key={s} className="ri-star-fill text-amber-300 text-[10px] animate-pulse" style={{ animationDelay: `${s * 150}ms` }} />)}
                  <span className="text-[10px] text-white/70 ml-1 font-bold">4.9 (142 reseñas)</span>
                </div>
              </div>

              {/* Stat grande con contador */}
              <div className="mt-auto pt-8">
                <div className="text-5xl font-extrabold text-white tracking-tight flex items-baseline">
                  +{googleVis}%
                </div>
                <div className="text-xs text-white/75 mt-1.5 font-medium leading-normal">
                  más visibilidad en búsquedas locales de tu distrito
                </div>
              </div>
            </div>
          </div>

          {/* CARD 5 — WhatsApp (ancha, col-span-2) */}
          <div
            className={`md:col-span-2 lg:col-span-1 group relative overflow-hidden rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#25D366]/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-550 cursor-pointer p-7 md:p-8 flex flex-col gap-4 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '500ms' }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-[#25D366]/10 group-hover:bg-[#25D366]/15 transition-colors rounded-xl shrink-0">
                <i className="ri-whatsapp-line text-[#25D366] text-xl animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#111827] mb-1">Pedidos directos por WhatsApp</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  Tus clientes agregan al carrito y el pedido llega directo a tu WhatsApp. Sin apps extra, sin comisiones.
                </p>
              </div>
            </div>

            {/* Simulación burbuja WhatsApp animada */}
            <div className="bg-[#EFEAE2] rounded-xl p-4 flex flex-col gap-3 min-h-[140px] relative overflow-hidden border border-[#D1D5DB]/30 shadow-inner">
              {/* Fondo patrón sutil de whatsapp */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpath d='M40 0c22.091 0 40 17.909 40 40S62.091 80 40 80 0 62.091 0 40 17.909 0 40 0zm0 5C20.67 5 5 20.67 5 40s15.67 35 35 35 35-15.67 35-35S59.33 5 40 5z' fill='%23000' fill-opacity='.1' fill-rule='evenodd'/%3E%3C/svg%3E")`
                }}
              />

              {/* Mensaje 1: Cliente (Aparece con animación fade-in-up siempre) */}
              <div className="flex items-end gap-2 relative z-10 animate-fade-in-up">
                <div className="bg-white rounded-2xl rounded-bl-none px-3.5 py-2 shadow-sm max-w-[220px]">
                  <p className="text-[11px] text-[#111827] font-medium">
                    🛍 Nuevo pedido de <strong>Carlos</strong>
                  </p>
                  <p className="text-[10px] text-[#6B7280] mt-0.5 font-semibold">
                    Pollo a la brasa x2 · S/ 48.00
                  </p>
                  <span className="block text-[8px] text-[#9CA3AF] text-right mt-1">12:30 PM</span>
                </div>
              </div>

              {/* Mensaje 2: Negocio / Respuesta */}
              {chatStep === 1 && (
                <div className="flex items-end gap-2 justify-end relative z-10 animate-scale-in">
                  <div className="bg-[#E2F9CB] rounded-2xl rounded-br-none px-4 py-2.5 shadow-sm">
                    {/* Bouncing dots typing indicator */}
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-[#128C7E] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-[#128C7E] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-[#128C7E] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              {(chatStep === 2 || chatStep === 3) && (
                <div className="flex items-end gap-2 justify-end relative z-10 animate-fade-in-up">
                  <div className="bg-[#E2F9CB] rounded-2xl rounded-br-none px-3.5 py-2 shadow-sm max-w-[200px]">
                    <p className="text-[11px] text-[#111827] leading-relaxed">
                      ¡Perfecto Carlos! Tu pedido estará listo en 30 min 🍗
                    </p>
                    <span className="block text-[8px] text-[#586366] text-right mt-1">
                      12:31 PM <i className="ri-double-check-line text-blue-500" />
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Pills */}
            <div className="flex flex-wrap gap-2">
              {['Sin comisiones', 'Instantáneo', 'Sin apps extra'].map(p => (
                <span key={p} className="text-[11px] font-semibold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] px-3 py-1 rounded-full group-hover:bg-[#15803D] group-hover:text-white group-hover:border-transparent transition-all duration-300">
                  {p}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Beneficios