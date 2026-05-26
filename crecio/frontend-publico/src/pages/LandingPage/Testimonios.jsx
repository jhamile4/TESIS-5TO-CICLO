import { useRef, useEffect, useState } from 'react'

const negociosFotos = [
  { nombre: 'Cafe Andino',            img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&q=80' },
  { nombre: 'Floreria Rosas',         img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&q=80' },
  { nombre: 'Panaderia La Tradicion', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80' },
  { nombre: 'Boutique Valentina',     img: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=500&q=80' },
  { nombre: 'Ferreteria Don Carlos',  img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80' },
  { nombre: 'Polleria El Sabor',      img: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500&q=80' },
]

const testimonios = [
  {
    nombre: 'Rosa Flores',
    negocio: 'Panaderia La Tradicion',
    estrellas: 5,
    texto: 'El buscador de CRECIO me trajo clientes nuevos del barrio que ni sabían que existía. Ahora tengo pedidos anticipados.',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&q=80',
  },
  {
    nombre: 'Lucia Torres',
    negocio: 'Floreria Rosas',
    estrellas: 5,
    texto: 'La IA me ayuda a escribir las descripciones de mis productos en segundos. Antes me tomaba horas.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=80s',
  },
  {
    nombre: 'Juan Paredes',
    negocio: 'Polleria El Sabor',
    estrellas: 5,
    texto: 'Mi pollería ahora aparece cuando buscan "pollería cerca de mí". Los pedidos por WhatsApp se triplicaron.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
  },
  {
    nombre: 'Ana Gutierrez',
    negocio: 'Cafe Andino',
    estrellas: 5,
    texto: 'CRECIO me dio una presencia digital profesional sin tener que aprender tecnología ni contratar un equipo de marketing.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80',
  },
  {
    nombre: 'Carlos Mendoza',
    negocio: 'Ferreteria Don Carlos',
    estrellas: 5,
    texto: 'Nunca pensé que podría tener una tienda online. CRECIO lo hizo super fácil. Mis clientes ven mi inventario desde el celular.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80',
  },
  {
    nombre: 'Maria Quispe',
    negocio: 'Boutique Valentina',
    estrellas: 5,
    texto: 'Antes vendía solo por WhatsApp. Con CRECIO tengo mi catálogo online y mis ventas subieron 60% en el primer mes.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80',
  },
]

const stats = [
  { valor: '2,400+', label: 'Negocios activos'           },
  { valor: '60%',    label: 'Aumento promedio en ventas'  },
  { valor: '14 días',label: 'Prueba gratis'               },
  { valor: '5 min',  label: 'Para empezar'                },
]

// Cuadruplicar para loop suave
const fotosLoop  = [...negociosFotos, ...negociosFotos, ...negociosFotos, ...negociosFotos]
const testiLoop  = [...testimonios,   ...testimonios,   ...testimonios,   ...testimonios]

function Testimonios() {
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
    <section ref={sectionRef} className="relative py-20 md:py-28 bg-white overflow-hidden">

      {/* ── Header ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-12">
        <div className={`transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#0D9488] mb-3">
                Testimonios
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#111827] leading-[1.1] tracking-tight">
                Negocios reales.
                <br />
                <span className="gradient-teal">Resultados reales.</span>
              </h2>
            </div>
            <p className="text-[#6B7280] text-sm md:text-base max-w-sm md:text-right">
              Más de 2,400 negocios peruanos ya usan CRECIO para crecer su presencia digital.
            </p>
          </div>
        </div>
      </div>

      {/* ── Fila 1: Fotos de negocios → (igual al ref: w-72 h-48 md:w-80 md:h-52) ── */}
      <div className={`relative mb-4 overflow-hidden py-2 transition-all duration-1000 delay-200 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        <div className="flex gap-4 animate-marquee-fast w-max">
          {fotosLoop.map((n, i) => (
            <div
              key={i}
              className="relative w-72 h-48 md:w-80 md:h-52 shrink-0 rounded-xl overflow-hidden group cursor-pointer"
            >
              <img
                src={n.img}
                alt={n.nombre}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-white text-sm font-semibold">{n.nombre}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Fila 2: Cards de testimonios ← ── */}
      <div className={`relative mb-16 overflow-hidden py-2 transition-all duration-1000 delay-400 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        <div className="flex gap-4 animate-marquee-fast-reverse w-max">
          {testiLoop.map((t, i) => (
            <div
              key={i}
              className="w-80 md:w-96 shrink-0 rounded-xl bg-[#F3F4F6] hover:bg-[#E5E7EB] transition-colors p-5 md:p-6 flex flex-col justify-between"
            >
              <div>
                {/* Estrellas */}
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.estrellas }).map((_, j) => (
                    <i key={j} className="ri-star-fill text-amber-400 text-sm" />
                  ))}
                </div>
                {/* Texto */}
                <p className="text-[#374151] text-sm leading-relaxed mb-4">
                  &ldquo;{t.texto}&rdquo;
                </p>
              </div>
              {/* Autor con foto real */}
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.nombre}
                  className="w-9 h-9 rounded-full object-cover shrink-0"
                />
                <div>
                  <div className="text-sm font-semibold text-[#111827]">{t.nombre}</div>
                  <div className="text-xs text-[#6B7280]">{t.negocio}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className={`max-w-7xl mx-auto px-4 md:px-8 transition-all duration-1000 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-12 py-8 border-t border-b border-[#E5E7EB]">
          {stats.map((s) => (
            <div key={s.label} className="text-center md:text-left">
              <div className="text-2xl md:text-3xl font-bold text-[#111827]">{s.valor}</div>
              <div className="text-xs text-[#6B7280] mt-1 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonios