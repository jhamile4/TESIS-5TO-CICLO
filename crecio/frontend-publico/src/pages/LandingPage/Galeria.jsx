const imagenes = [
  {
    src: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80',
    alt: 'Panadería artesanal',
    className: 'w-44 h-56 md:w-56 md:h-72 rounded-2xl shadow-2xl',
    style: { animation: 'float 6s ease-in-out infinite' },
    pos: 'absolute left-[5%] top-[8%] md:left-[10%]',
  },
  {
    src: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=500&q=80',
    alt: 'Boutique de moda',
    className: 'w-52 h-36 md:w-72 md:h-48 rounded-2xl shadow-2xl',
    style: { animation: 'float-reverse 7s ease-in-out infinite' },
    pos: 'absolute left-[2%] top-[50%] md:left-[5%]',
  },
  {
    src: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80',
    alt: 'Ferretería moderna',
    className: 'w-40 h-52 md:w-48 md:h-64 rounded-2xl shadow-2xl',
    style: { animation: 'float 8s ease-in-out infinite 1s' },
    pos: 'absolute left-[35%] top-[5%] md:left-[38%]',
  },
  {
    src: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500&q=80',
    alt: 'Restaurante moderno',
    className: 'w-48 h-32 md:w-64 md:h-44 rounded-2xl shadow-2xl',
    style: { animation: 'float-reverse 6.5s ease-in-out infinite 0.5s' },
    pos: 'absolute left-[32%] top-[45%] md:left-[35%]',
  },
  {
    src: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=500&q=80',
    alt: 'Taller tech',
    className: 'w-36 h-48 md:w-44 md:h-60 rounded-2xl shadow-2xl',
    style: { animation: 'float 7.5s ease-in-out infinite 2s' },
    pos: 'absolute left-[62%] top-[12%] md:left-[65%]',
  },
  {
    src: 'https://images.unsplash.com/photo-1444021465936-c6ca81d39b84?w=500&q=80',
    alt: 'Floristería',
    className: 'w-44 h-32 md:w-56 md:h-40 rounded-2xl shadow-2xl',
    style: { animation: 'float-reverse 8s ease-in-out infinite 1.5s' },
    pos: 'absolute left-[60%] top-[52%] md:left-[62%]',
  },
]

const categorias = [
  'Pollerías','Boutiques','Ferreterías','Panaderías','Tecnología','Florerías',
  'Restaurantes','Cafeterías','Farmacias','Kioskos','Talleres','Salones',
]

function Galeria() {
  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-28">

      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-16 flex flex-col items-center text-center">
          <span className="inline-flex items-center rounded-full bg-[#0D9488]/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0D9488] mb-4">
            Galería de negocios
          </span>
          <h2 className="max-w-3xl text-4xl md:text-5xl lg:text-[56px] font-extrabold text-[#111827] leading-[1.1] tracking-tight">
            Cada negocio tiene
            <br />
            <span className="gradient-teal">su propia identidad</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base text-[#4B5563] leading-relaxed">
            Desde la pollería del barrio hasta la boutique de moda. CRECIO respeta y potencia la esencia de cada emprendimiento.
          </p>
        </div>
      </div>

      {/* Galería flotante asimétrica */}
      <div className="relative mx-auto h-[500px] max-w-6xl overflow-hidden md:h-[600px]">
        {imagenes.map((img, i) => (
          <div key={i} className={img.pos}>
            <img
              src={img.src}
              alt={img.alt}
              className={`${img.className} object-cover object-top`}
              style={img.style}
              loading="lazy"
            />
          </div>
        ))}

        {/* Contador central */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-white/80 px-8 py-6 shadow-xl backdrop-blur-md md:px-12 md:py-8">
            <div className="text-center">
              <span className="block text-4xl font-bold text-[#111827] md:text-6xl">+2,400</span>
              <span className="mt-1 block text-xs font-semibold uppercase tracking-widest text-[#9CA3AF] md:text-sm">
                Negocios activos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee de categorías */}
      <div className="mt-12 overflow-hidden border-y border-[#F3F4F6] py-4">
        <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap">
          {[...categorias, ...categorias].map((cat, i) => (
            <span key={i} className="flex items-center gap-3 text-sm font-semibold text-[#111827] uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0D9488]" />
              {cat}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Galeria