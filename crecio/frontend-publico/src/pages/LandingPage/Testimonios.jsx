import { useRef, useEffect, useState } from 'react'

// Tiendas que existen en CRECIO (las fotos son ilustrativas del rubro)
const negociosFotos = [
  { nombre: 'Floreria Primavera',     img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&q=80' },
  { nombre: 'Panaderia La Tradicion', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80' },
  { nombre: 'Boutique Valentina',     img: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=500&q=80' },
  { nombre: 'Ferreteria Don Carlos',  img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80' },
  { nombre: 'Polleria El Sabor',      img: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500&q=80' },
  { nombre: 'Sant Royal Peru',        img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&q=80' },
]

// Qué puede hacer cada tipo de negocio con lo que CRECIO ya ofrece (no son testimonios)
const testimonios = [
  {
    nombre: 'Panaderías',
    icono: 'ri-cake-3-line',
    texto: 'Muestra tu catálogo con precios y recibe pedidos anticipados con pago en efectivo o tarjeta, para delivery o recojo en tienda.',
  },
  {
    nombre: 'Florerías',
    icono: 'ri-flower-line',
    texto: 'Redacta con IA la publicación de tus arreglos para fechas especiales y publícala en tu Página de Facebook e Instagram.',
  },
  {
    nombre: 'Pollerías y restaurantes',
    icono: 'ri-restaurant-line',
    texto: 'Tus clientes arman su pedido desde el celular y te llega por WhatsApp o como pedido online con seguimiento.',
  },
  {
    nombre: 'Ferreterías',
    icono: 'ri-hammer-line',
    texto: 'Controla tu inventario y tu stock baja solo con cada venta; el panel te avisa cuando un producto se está acabando.',
  },
  {
    nombre: 'Boutiques',
    icono: 'ri-t-shirt-line',
    texto: 'Programa tus publicaciones para que salgan solas a la hora que más te conviene y revisa tus ventas del mes.',
  },
  {
    nombre: 'Cualquier emprendimiento',
    icono: 'ri-store-2-line',
    texto: 'Recibe reseñas de compras verificadas y lleva tus ingresos, gastos y ganancia en un solo lugar.',
  },
]

// Datos verdaderos del producto
const stats = [
  { valor: 'S/ 0',    label: 'Para empezar (plan gratis)' },
  { valor: '2',       label: 'Formas de pago: tarjeta o efectivo' },
  { valor: 'FB + IG', label: 'Publicación directa en tus redes' },
  { valor: '24/7',    label: 'Tu tienda abierta en internet' },
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
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-16">
        <div className={`text-center transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-flex items-center rounded-full bg-[#0D9488]/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0D9488] mb-4">
            Para quién es
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold text-[#111827] leading-[1.1] tracking-tight">
            Pensado para
            <br />
            <span className="gradient-teal">negocios como el tuyo.</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base text-[#4B5563] leading-relaxed">
            Así puede usar CRECIO cada tipo de negocio local, con las herramientas que ya están disponibles.
          </p>
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
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-[#0D9488]/10 flex items-center justify-center shrink-0">
                  <i className={`${t.icono} text-[#0D9488]`} />
                </div>
                <div className="text-sm font-semibold text-[#111827]">{t.nombre}</div>
              </div>
              <p className="text-[#374151] text-sm leading-relaxed">{t.texto}</p>
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