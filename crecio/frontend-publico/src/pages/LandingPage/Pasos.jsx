import { useState, useEffect, useRef } from 'react'

const pasos = [
  {
    numero: '01',
    titulo: 'Crea tu tienda',
    subtitulo: 'En 5 minutos',
    descripcion:
      'Regístrate, personaliza tu perfil de negocio y configura tu catálogo con fotos, precios y descripciones. Sin conocimientos técnicos. La IA genera todo por ti.',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&q=80',
  },
  {
    numero: '02',
    titulo: 'La IA trabaja por ti',
    subtitulo: 'Automatización total',
    descripcion:
      'Nuestra inteligencia artificial genera descripciones de productos, sugiere precios competitivos y crea campañas de marketing automáticamente. Tú solo vende.',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&q=80',
  },
  {
    numero: '03',
    titulo: 'Vende y crece',
    subtitulo: 'Resultados reales',
    descripcion:
      'Recibe pedidos, gestiona tu inventario y analiza tus ventas desde un panel simple. Tus clientes te encuentran en el buscador local de CRECIO y en Google.',
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=700&q=80',
  },
]

function Pasos() {
  const [headerVisible, setHeaderVisible] = useState(false)
  const [visibles, setVisibles]           = useState([false, false, false])
  const headerRef = useRef(null)
  const stepRefs  = useRef([])

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeaderVisible(true) },
      { threshold: 0.1 }
    )
    if (headerRef.current) obs.observe(headerRef.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = stepRefs.current.indexOf(entry.target)
            if (idx !== -1)
              setVisibles(prev => prev.map((v, i) => (i === idx ? true : v)))
          }
        })
      },
      { threshold: 0.2 }
    )
    stepRefs.current.forEach(el => { if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  return (
    <section
      id="como-funciona"
      className="relative overflow-hidden bg-[#0a0a0a] py-28 md:py-36"
    >
      {/* Textura de fondo */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">

        {/* Header */}
        <div
          ref={headerRef}
          className={`mb-20 md:mb-28 transition-all duration-1000 ${
            headerVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <span className="inline-flex items-center rounded-full bg-[#0D9488]/20 border border-[#0D9488]/30 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0D9488] mb-4">
            Proceso
          </span>
          <h2 className="mt-4 max-w-3xl text-4xl md:text-5xl lg:text-[56px] font-extrabold leading-[1.1] tracking-tight text-white">
            Tres pasos para
            <br />
            <span className="gradient-teal">digitalizar tu negocio</span>
          </h2>
          <p className="mt-4 max-w-2xl text-sm md:text-base text-white/60 leading-relaxed">
            No necesitas saber de tecnología. CRECIO hace el trabajo difícil por ti.
          </p>
        </div>

        {/* Pasos */}
        <div className="relative space-y-24 md:space-y-32">

          {/* Línea vertical decorativa */}
          <div className="absolute left-6 top-0 hidden h-full w-[1px] bg-gradient-to-b from-[#0D9488]/40 via-[#0D9488]/20 to-transparent md:left-12 lg:block" />

          {pasos.map((paso, idx) => (
            <div
              key={paso.numero}
              ref={el => { stepRefs.current[idx] = el }}
              className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20"
            >
              {/* Número + Texto */}
              <div className={idx % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="flex items-start gap-6 lg:gap-10">

                  {/* Número grande */}
                  <div className="relative shrink-0 select-none">
                    <span className="block text-6xl font-bold leading-none tracking-tighter text-[#1a1a1a] md:text-8xl lg:text-9xl">
                      {paso.numero}
                    </span>
                    <span className="absolute left-0 top-0 block text-6xl font-bold leading-none tracking-tighter text-[#0D9488] md:text-8xl lg:text-9xl">
                      {paso.numero}
                    </span>
                  </div>

                  {/* Texto */}
                  <div className="pt-2 md:pt-4">
                    <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-[#0D9488]">
                      {paso.subtitulo}
                    </span>
                    <h3 className="text-2xl font-bold tracking-tight text-white md:text-3xl lg:text-4xl">
                      {paso.titulo}
                    </h3>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-white/50 md:text-base">
                      {paso.descripcion}
                    </p>
                  </div>
                </div>
              </div>

              {/* Imagen */}
              <div className={idx % 2 === 1 ? 'lg:order-1' : ''}>
                <div
                  className={`group relative overflow-hidden rounded-2xl transition-all duration-700 ${
                    visibles[idx]
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-8 opacity-0'
                  }`}
                >
                  <img
                    src={paso.img}
                    alt={paso.titulo}
                    className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-80"
                    loading="lazy"
                  />
                  {/* Overlay con número */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                    <span className="select-none text-4xl font-bold text-white/20 md:text-5xl">
                      {paso.numero}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pasos