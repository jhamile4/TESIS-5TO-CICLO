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
    pills: ['Sin comisiones', 'Instantáneo', 'Sin apps extra'],
  },
]

const bars = [35, 55, 48, 72, 90, 65, 85]

function Beneficios() {
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="beneficios"
      className="relative py-24 md:py-32 bg-[#FAFAFA] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div className={`text-center mb-14 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block rounded-full border border-[#E5E7EB] px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF] mb-4">
            Para tu negocio
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#111827] leading-[1.1] tracking-tight">
            Lo que obtienes
            <br />
            <span className="text-[#0D9488]">con CRECIO</span>
          </h2>
          <p className="mt-5 max-w-lg mx-auto text-sm md:text-base text-[#6B7280] leading-relaxed">
            Todo lo que un negocio moderno necesita para crecer digitalmente. Sin complicaciones.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">

          {/* CARD 1 — Tienda digital (tall, col-span-1 row-span-2) */}
          <div
            className={`lg:row-span-2 group relative overflow-hidden rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#0D9488]/30 hover:shadow-xl transition-all duration-700 cursor-pointer flex flex-col min-h-[360px] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '100ms' }}
          >
            {/* Imagen de fondo superior */}
            <div className="relative h-52 overflow-hidden shrink-0">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80"
                alt="Tienda digital"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            </div>

            {/* Contenido */}
            <div className="p-7 md:p-8 flex flex-col flex-1">
              <div className="w-11 h-11 flex items-center justify-center bg-[#0D9488]/10 rounded-xl mb-5">
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
                <i className="ri-arrow-right-line text-[#0D9488] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* CARD 2 — IA (dark, medium) */}
          <div
            className={`group relative overflow-hidden rounded-2xl bg-[#111827] border border-[#1F2937] hover:border-[#0D9488]/30 hover:shadow-xl transition-all duration-700 cursor-pointer p-7 md:p-8 flex flex-col ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '200ms' }}
          >
            {/* Glow decorativo */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#0D9488]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-11 h-11 flex items-center justify-center bg-[#0D9488]/15 rounded-xl mb-5 relative z-10">
              <i className="ri-sparkling-2-line text-[#0D9488] text-xl" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 relative z-10">IA que trabaja por ti</h3>
            <p className="text-sm text-[#9CA3AF] leading-relaxed flex-1 relative z-10">
              Genera descripciones, precios y campañas de marketing automáticamente. Solo sube una foto.
            </p>

            {/* Tags flotantes */}
            <div className="flex flex-wrap gap-2 mt-5 relative z-10">
              {['Descripciones', 'Precios IA', 'Marketing'].map(t => (
                <span key={t} className="text-[10px] font-semibold bg-white/5 border border-white/10 text-white/60 px-2.5 py-1 rounded-full">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#0D9488] relative z-10 group-hover:gap-3 transition-all">
              Próximamente <i className="ri-arrow-right-line" />
            </div>
          </div>

          {/* CARD 3 — Analítica (blanca, medium) */}
          <div
            className={`group relative overflow-hidden rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#0D9488]/30 hover:shadow-xl transition-all duration-700 cursor-pointer p-7 md:p-8 flex flex-col ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="w-11 h-11 flex items-center justify-center bg-[#0D9488]/10 rounded-xl mb-5">
              <i className="ri-bar-chart-box-line text-[#0D9488] text-xl" />
            </div>
            <h3 className="text-lg font-bold text-[#111827] mb-2">Analítica en tiempo real</h3>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              Ventas, visitas y conversiones. Todo en un panel simple desde tu celular.
            </p>

            {/* Mini chart */}
            <div className="mt-5 flex items-end gap-1.5 h-14">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm transition-all duration-1000"
                  style={{
                    height: visible ? `${h}%` : '0%',
                    transitionDelay: `${600 + i * 80}ms`,
                    background: i === 5 ? '#0D9488' : i === 6 ? '#0D9488' : `rgba(13,148,136,${0.15 + i * 0.1})`,
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {['L','M','X','J','V','S','D'].map(d => (
                <span key={d} className="flex-1 text-center text-[9px] text-[#9CA3AF]">{d}</span>
              ))}
            </div>
          </div>

          {/* CARD 4 — Google (tall dark, col-span-1 row-span-2) */}
          <div
            className={`lg:row-span-2 group relative overflow-hidden rounded-2xl bg-[#0D9488] hover:shadow-2xl hover:shadow-[#0D9488]/20 transition-all duration-700 cursor-pointer flex flex-col min-h-[360px] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '200ms' }}
          >
            {/* Imagen de fondo */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&q=80"
                alt="Aparecer en Google"
                className="w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D9488] via-[#0D9488]/80 to-[#0D9488]/60" />
            </div>

            {/* Contenido */}
            <div className="relative z-10 p-7 md:p-8 flex flex-col flex-1">
              <div className="w-11 h-11 flex items-center justify-center bg-white/15 rounded-xl mb-5">
                <i className="ri-search-eye-line text-white text-xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Aparece en Google</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Tus clientes te encuentran cuando buscan negocios cerca. Posicionamiento local incluido.
              </p>

              {/* Simulación resultado de búsqueda */}
              <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/15">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center">
                    <i className="ri-global-line text-white text-[8px]" />
                  </div>
                  <span className="text-[10px] text-white/50">google.com › maps</span>
                </div>
                <p className="text-xs font-semibold text-[#5EEAD4] mb-1">Tu negocio · Lima, Perú</p>
                <p className="text-[10px] text-white/60 mb-2">Abierto ahora · Ver más</p>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(s => <i key={s} className="ri-star-fill text-amber-300 text-[10px]" />)}
                  <span className="text-[10px] text-white/60 ml-1">4.9 (142)</span>
                </div>
              </div>

              {/* Stat grande */}
              <div className="mt-auto pt-6">
                <div className="text-4xl font-bold text-white">+300%</div>
                <div className="text-xs text-white/60 mt-1">más visibilidad en búsquedas locales</div>
              </div>
            </div>
          </div>

          {/* CARD 5 — WhatsApp (ancha, col-span-2) */}
          <div
            className={`md:col-span-2 lg:col-span-1 group relative overflow-hidden rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#25D366]/40 hover:shadow-xl transition-all duration-700 cursor-pointer p-7 md:p-8 flex flex-col gap-4 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '500ms' }}
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 flex items-center justify-center bg-[#25D366]/10 rounded-xl shrink-0">
                <i className="ri-whatsapp-line text-[#25D366] text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#111827] mb-1">Pedidos directos por WhatsApp</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  Tus clientes agregan al carrito y el pedido llega directo a tu WhatsApp. Sin apps extra, sin comisiones.
                </p>
              </div>
            </div>

            {/* Simulación burbuja WhatsApp */}
            <div className="bg-[#F0FDF4] rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-end gap-2">
                <div className="bg-white rounded-xl rounded-bl-sm px-3 py-2 shadow-sm max-w-[200px]">
                  <p className="text-xs text-[#111827]">🛍 Nuevo pedido de <strong>Carlos</strong></p>
                  <p className="text-[10px] text-[#6B7280] mt-0.5">Pollo a la brasa x2 · S/ 48.00</p>
                </div>
              </div>
              <div className="flex items-end gap-2 justify-end">
                <div className="bg-[#25D366] rounded-xl rounded-br-sm px-3 py-2 max-w-[180px]">
                  <p className="text-xs text-white">¡Perfecto! Tu pedido estará listo en 30 min 🍗</p>
                </div>
              </div>
            </div>

            {/* Pills */}
            <div className="flex flex-wrap gap-2">
              {['Sin comisiones', 'Instantáneo', 'Sin apps extra'].map(p => (
                <span key={p} className="text-[11px] font-semibold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] px-3 py-1 rounded-full">
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