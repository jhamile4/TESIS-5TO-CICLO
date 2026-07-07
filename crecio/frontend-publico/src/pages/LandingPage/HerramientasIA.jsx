import { useRef, useEffect, useState } from 'react'

const herramientas = [
  {
    icono: 'ri-camera-ai-line',
    titulo: 'Carga Mágica con IA',
    descripcion: 'Sube una foto de tu producto y la IA genera título, descripción y precio sugerido automáticamente.',
    size: 'large',
    img: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=700&q=80',
  },
  {
    icono: 'ri-megaphone-line',
    titulo: 'Marketing Automático',
    descripcion: 'Genera publicaciones para redes sociales, emails y campañas con un solo clic usando IA.',
    size: 'medium',
  },
  {
    icono: 'ri-bar-chart-box-line',
    titulo: 'Análisis Predictivo',
    descripcion: 'Predice qué productos se venderán más y cuándo reponer tu inventario antes de quedarte sin stock.',
    size: 'medium',
  },
  {
    icono: 'ri-customer-service-2-line',
    titulo: 'Asistente Virtual',
    descripcion: 'Un chatbot con IA responde preguntas de tus clientes 24/7 directamente desde tu catálogo.',
    size: 'wide',
    img: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&q=80',
  },
]

function HerramientasIA() {
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.12 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="ia-tools"
      className="relative py-24 md:py-32 bg-[#FAFAFA] overflow-hidden"
    >
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `radial-gradient(circle, #0D9488 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-flex items-center rounded-full bg-[#0D9488]/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0D9488] mb-4">
            Inteligencia Artificial
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold text-[#111827] leading-[1.1] tracking-tight">
            IA que trabaja
            <br />
            <span className="gradient-teal">por ti</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base text-[#4B5563] leading-relaxed">
            No necesitas ser experto en marketing. Nuestra IA hace el trabajo pesado para que tú te concentres en lo que sabes hacer.
          </p>
        </div>

        {/* Bento Grid — igual al ref */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">

          {/* Card grande — lg:row-span-2 */}
          <div
            className={`lg:row-span-2 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '100ms' }}
          >
            <div className="relative h-full bg-[#111827] rounded-2xl overflow-hidden group cursor-pointer border border-[#1F2937] hover:border-[#0D9488]/30 transition-all duration-500">
              <div className="absolute inset-0">
                <img
                  src={herramientas[0].img}
                  alt={herramientas[0].titulo}
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/60 to-transparent" />
              </div>
              <div className="relative z-10 p-7 md:p-8 h-full flex flex-col justify-end min-h-[320px] lg:min-h-0">
                <div className="w-12 h-12 flex items-center justify-center bg-[#0D9488]/10 rounded-xl mb-5">
                  <i className={`${herramientas[0].icono} text-2xl text-[#0D9488]`} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{herramientas[0].titulo}</h3>
                <p className="text-[#9CA3AF] text-sm leading-relaxed max-w-xs">{herramientas[0].descripcion}</p>
                <div className="mt-6 flex items-center gap-2 text-[#0D9488] text-sm font-semibold group-hover:gap-3 transition-all">
                  <span>Próximamente</span>
                  <i className="ri-arrow-right-line" />
                </div>
              </div>
            </div>
          </div>

          {/* Cards medianas */}
          {[herramientas[1], herramientas[2]].map((h, idx) => (
            <div
              key={h.titulo}
              className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${200 + idx * 100}ms` }}
            >
              <div className="bg-white rounded-2xl p-7 md:p-8 border border-[#E5E7EB] h-full flex flex-col group hover:border-[#0D9488]/30 hover:shadow-lg hover:shadow-[#0D9488]/5 transition-all duration-500 cursor-pointer">
                <div className="w-11 h-11 flex items-center justify-center bg-[#0D9488]/10 rounded-xl mb-5 group-hover:bg-[#0D9488]/15 transition-colors">
                  <i className={`${h.icono} text-xl text-[#0D9488]`} />
                </div>
                <h3 className="text-lg font-bold text-[#111827] mb-2">{h.titulo}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed flex-1">{h.descripcion}</p>
                <div className="mt-5 flex items-center gap-2 text-[#0D9488] text-sm font-semibold group-hover:gap-3 transition-all">
                  <span>Próximamente</span>
                  <i className="ri-arrow-right-line" />
                </div>
              </div>
            </div>
          ))}

          {/* Card ancha — lg:col-span-3 (full width) */}
          <div
            className={`md:col-span-2 lg:col-span-3 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '400ms' }}
          >
            <div className="relative bg-[#111827] rounded-2xl overflow-hidden group cursor-pointer border border-[#1F2937] hover:border-[#0D9488]/30 transition-all duration-500">
              <div className="absolute inset-0">
                <img
                  src={herramientas[3].img}
                  alt={herramientas[3].titulo}
                  className="w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#111827] via-[#111827]/70 to-transparent" />
              </div>
              <div className="relative z-10 p-7 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
                <div className="md:flex-1">
                  <div className="w-11 h-11 flex items-center justify-center bg-[#0D9488]/10 rounded-xl mb-5">
                    <i className={`${herramientas[3].icono} text-xl text-[#0D9488]`} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{herramientas[3].titulo}</h3>
                  <p className="text-[#9CA3AF] text-sm leading-relaxed max-w-lg">{herramientas[3].descripcion}</p>
                </div>
                <div className="shrink-0">
                  <div className="flex items-center gap-3 text-[#0D9488] text-sm font-semibold group-hover:gap-4 transition-all">
                    <span>Próximamente</span>
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0D9488]/10 group-hover:bg-[#0D9488]/20 transition-colors">
                      <i className="ri-arrow-right-line" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default HerramientasIA