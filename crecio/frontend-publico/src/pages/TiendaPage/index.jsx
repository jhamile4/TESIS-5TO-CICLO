import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import ProductoGrid from './components/ProductoGrid'
import ResenasList from './components/ResenasList'
import Carrito from './components/Carrito'
import ChatNegocio from './components/ChatNegocio'
import { getNegocio, getProductos, getResenas, getGaleria } from '../../services/apiPublico'

function TiendaPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [negocio, setNegocio]               = useState(null)
  const [productos, setProductos]           = useState([])
  const [resenas, setResenas]               = useState([])
  const [galeria, setGaleria]               = useState([])
  const [cargando, setCargando]             = useState(true)
  const [error, setError]                   = useState(null)
  const [carrito, setCarrito]               = useState([])
  const [carritoAbierto, setCarritoAbierto] = useState(false)
  const [tabActivo, setTabActivo]           = useState('productos')
  const [imgActiva, setImgActiva]           = useState(0)
  const intervalRef                         = useRef(null)

  useEffect(() => {
    setCargando(true); setError(null)
    Promise.all([getNegocio(id), getProductos(id), getResenas(id), getGaleria(id)])
      .then(([neg, prods, rese, gal]) => {
        setNegocio(neg); setProductos(prods); setResenas(rese)
        setGaleria(gal.length > 0 ? gal : [neg.img])
        setCargando(false)
      })
      .catch(err => { console.error(err); setError('No se pudo cargar la tienda'); setCargando(false) })
  }, [id])

  // Auto-slide cada 4 segundos
  useEffect(() => {
    if (!negocio || !galeria.length) return
    const total = [negocio.img, ...galeria.filter(g => g !== negocio.img)].length
    if (total <= 1) return
    intervalRef.current = setInterval(() => {
      setImgActiva(prev => (prev + 1) % total)
    }, 4000)
    return () => clearInterval(intervalRef.current)
  }, [galeria, negocio])

  const handleClickMiniatura = (i) => {
    setImgActiva(i)
    clearInterval(intervalRef.current)
  }

  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(p => p.pk_id === producto.pk_id)
      if (existe) return prev.map(p => p.pk_id === producto.pk_id ? { ...p, cantidad: p.cantidad + 1 } : p)
      return [...prev, { ...producto, cantidad: 1 }]
    })
    setCarritoAbierto(true)
  }

  const cambiarCantidad    = (pk_id, delta) => setCarrito(prev => prev.map(p => p.pk_id === pk_id ? { ...p, cantidad: Math.max(1, p.cantidad + delta) } : p))
  const eliminarDelCarrito = (pk_id) => setCarrito(prev => prev.filter(p => p.pk_id !== pk_id))
  const totalItems = carrito.reduce((a, p) => a + p.cantidad, 0)
  const subtotal   = carrito.reduce((a, p) => a + p.precio * p.cantidad, 0)

  const pedidoWhatsApp = () => {
    const lines = carrito.map(p => `- ${p.nombre} x${p.cantidad} = S/ ${(p.precio * p.cantidad).toFixed(2)}`).join('\n')
    const msg   = `Hola ${negocio.nombre}, quiero hacer este pedido desde CRECIO:\n\n${lines}\n\n*Total: S/ ${subtotal.toFixed(2)}*`
    window.open(`https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const waBase = negocio
    ? `https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent(`Hola ${negocio.nombre}, te encontré en CRECIO y quiero hacer un pedido`)}`
    : '#'

  if (cargando) return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-[#9CA3AF]">
        <i className="ri-loader-4-line text-3xl animate-spin text-[#0D9488]" />
        <span className="text-sm">Cargando tienda...</span>
      </div>
    </div>
  )

  if (error || !negocio) return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
        <i className="ri-store-off-line text-5xl text-[#E5E7EB]" />
        <h2 className="text-xl font-bold text-[#111827]">{error || 'Tienda no encontrada'}</h2>
        <button onClick={() => navigate('/')} className="px-6 py-2.5 rounded-xl bg-[#0D9488] text-white text-sm font-semibold cursor-pointer">
          Volver al inicio
        </button>
      </div>
    </div>
  )

  const todasLasImagenes = [negocio.img, ...galeria.filter(g => g !== negocio.img)]

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-0">
      <Navbar />

      {/* ── Hero — igual al ref: h-[320px] md:h-[420px] ── */}
      <div className="relative h-[320px] md:h-[420px] overflow-hidden">

        {/* Imágenes con fade */}
        {todasLasImagenes.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={negocio.nombre}
            className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700 ${
              i === imgActiva ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex items-start justify-between pt-20 md:pt-28">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-[#111827] px-4 py-2 rounded-full text-xs font-semibold hover:bg-white transition-all cursor-pointer"
          >
            <i className="ri-arrow-left-line text-sm" />
            Volver a buscar
          </button>
          <div className="flex items-center gap-2">
            {totalItems > 0 && (
              <button
                onClick={() => setCarritoAbierto(true)}
                className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-[#111827] px-3 py-2 rounded-full text-xs font-semibold hover:bg-white transition-all cursor-pointer"
              >
                <i className="ri-shopping-cart-2-line text-sm" />
                <span className="bg-[#0D9488] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{totalItems}</span>
              </button>
            )}
            {negocio.verificado && (
              <span className="bg-[#0D9488] text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                <i className="ri-verified-badge-fill text-xs" />
                Verificado CRECIO
              </span>
            )}
          </div>
        </div>

        {/* Info bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
          <div className="max-w-5xl mx-auto">
            <span className="inline-block bg-white/90 backdrop-blur-sm text-[#374151] text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
              {negocio.categoria}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-2">
              {negocio.nombre}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-white/80">
              <div className="flex items-center gap-1">
                <i className="ri-star-fill text-amber-400 text-sm" />
                <span className="text-sm font-bold">{negocio.rating}</span>
                <span className="text-xs">({negocio.resenas} reseñas)</span>
              </div>
              {negocio.direccion && (
                <>
                  <span className="text-white/40">|</span>
                  <div className="flex items-center gap-1 text-xs">
                    <i className="ri-map-pin-line text-sm" />
                    {negocio.direccion}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Miniaturas — fuera del hero con -mt-8, igual al ref ── */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-8 relative z-10">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {todasLasImagenes.map((img, i) => (
            <button
              key={i}
              onClick={() => handleClickMiniatura(i)}
              className={`relative w-20 h-14 md:w-28 md:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                imgActiva === i
                  ? 'border-[#0D9488] shadow-md'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover object-top" />
            </button>
          ))}
        </div>
      </div>

      {/* ── Body — igual al ref: mt-8 md:mt-10 ── */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 mt-8 md:mt-10 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Contenido principal */}
        <div className="lg:col-span-2 space-y-8">

          {negocio.desc && (
            <div>
              <h3 className="text-lg font-bold text-[#111827] mb-3 flex items-center gap-2">
                <i className="ri-store-2-line text-[#0D9488]" />
                Sobre este negocio
              </h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">{negocio.desc}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: 'ri-map-pin-2-line', label: 'Dirección', valor: negocio.direccion },
              { icon: 'ri-time-line',      label: 'Horario',   valor: negocio.horario   },
              { icon: 'ri-phone-line',     label: 'Teléfono',  valor: negocio.telefono  },
            ].filter(i => i.valor).map(item => (
              <div key={item.label} className="bg-[#FAFAFA] rounded-xl p-4 border border-[#E5E7EB]">
                <div className="w-9 h-9 flex items-center justify-center bg-[#0D9488]/10 rounded-xl mb-2">
                  <i className={`${item.icon} text-[#0D9488] text-sm`} />
                </div>
                <p className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-wider">{item.label}</p>
                <p className="text-sm text-[#111827] font-medium mt-1">{item.valor}</p>
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center gap-1 bg-[#F3F4F6] rounded-lg p-1 mb-6">
              {[
                { key: 'productos', label: `Productos (${productos.length})` },
                { key: 'resenas',   label: `Reseñas (${resenas.length})`     },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setTabActivo(t.key)}
                  className={`flex-1 py-2.5 rounded-md text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    tabActivo === t.key ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6B7280] hover:text-[#374151]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {tabActivo === 'productos' && (
              <ProductoGrid productos={productos} onAgregar={agregarAlCarrito} whatsapp={negocio.whatsapp} waBase={waBase} />
            )}
            {tabActivo === 'resenas' && <ResenasList reviews={resenas} />}
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#111827] mb-3 flex items-center gap-2">
              <i className="ri-map-pin-2-line text-[#0D9488]" />
              Ubicación
            </h3>
            <div className="rounded-xl overflow-hidden border border-[#E5E7EB] h-[280px]">
              {negocio.latitud && negocio.longitud ? (
                <iframe
                  title="Ubicación"
                  src={`https://www.google.com/maps?q=${negocio.latitud},${negocio.longitud}&output=embed&z=16`}
                  width="100%" height="100%" style={{ border: 0 }}
                  allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#FAFAFA] text-[#9CA3AF] text-sm">
                  <div className="text-center">
                    <i className="ri-map-pin-off-line text-3xl block mb-2" />
                    Ubicación no disponible
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-6 space-y-4">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
              <h4 className="font-bold text-[#111827] mb-1">¿Te interesa algo?</h4>
              <p className="text-xs text-[#6B7280] mb-4 leading-relaxed">
                Agrega productos al carrito o contacta directamente por WhatsApp.
              </p>
              {totalItems > 0 && (
                <div className="mb-4 p-3 bg-[#FAFAFA] rounded-xl border border-[#E5E7EB]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#6B7280]">{totalItems} producto(s)</span>
                    <span className="text-sm font-bold text-[#111827]">S/ {subtotal.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => setCarritoAbierto(true)}
                    className="w-full py-2.5 bg-[#0D9488] hover:bg-[#0F766E] text-white rounded-lg font-semibold text-xs transition-all cursor-pointer"
                  >
                    Ver carrito
                  </button>
                </div>
              )}
              <a
                href={waBase} target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl font-bold text-sm transition-all cursor-pointer"
              >
                <i className="ri-whatsapp-line text-base" />
                Escribir por WhatsApp
              </a>
              <button className="flex items-center justify-center gap-2 w-full py-3 mt-2 bg-white border border-[#E5E7EB] hover:border-[#0D9488]/30 hover:bg-[#FAFAFA] text-[#111827] rounded-xl font-bold text-sm transition-all cursor-pointer">
                <i className="ri-external-link-line text-sm" />
                Ver catálogo externo
              </button>
            </div>

            <div className="bg-[#FAFAFA] rounded-2xl border border-[#E5E7EB] p-5">
              <h4 className="font-bold text-[#111827] text-sm mb-3">Horario de atención</h4>
              {negocio.horario && (
                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <div className="w-8 h-8 flex items-center justify-center bg-[#0D9488]/10 rounded-lg shrink-0">
                    <i className="ri-time-line text-[#0D9488] text-sm" />
                  </div>
                  <span>{negocio.horario}</span>
                </div>
              )}
              {negocio.telefono && (
                <div className="flex items-center gap-2 text-sm text-[#6B7280] mt-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-[#0D9488]/10 rounded-lg shrink-0">
                    <i className="ri-phone-line text-[#0D9488] text-sm" />
                  </div>
                  <span>{negocio.telefono}</span>
                </div>
              )}
            </div>

            {negocio.verificado && (
              <div className="bg-[#0D9488]/5 rounded-2xl border border-[#0D9488]/10 p-4">
                <div className="flex items-center gap-2">
                  <i className="ri-shield-check-line text-[#0D9488] text-lg" />
                  <span className="text-sm font-semibold text-[#0D9488]">Negocio verificado</span>
                </div>
                <p className="text-xs text-[#6B7280] mt-1">Este negocio pasó por nuestro proceso de verificación.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botón flotante carrito desktop */}
      {totalItems > 0 && (
        <button
          onClick={() => setCarritoAbierto(true)}
          className="hidden lg:flex fixed bottom-6 right-6 z-50 bg-[#111827] text-white w-14 h-14 rounded-full shadow-xl items-center justify-center hover:bg-[#374151] transition-all cursor-pointer"
        >
          <div className="relative">
            <i className="ri-shopping-cart-2-line text-xl" />
            <span className="absolute -top-2 -right-2 bg-[#0D9488] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          </div>
        </button>
      )}

      {/* WhatsApp flotante mobile */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
        <a
          href={waBase} target="_blank" rel="noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl font-bold text-sm transition-all shadow-lg cursor-pointer"
        >
          <i className="ri-whatsapp-line text-base" />
          Escribir por WhatsApp
        </a>
      </div>

      {carritoAbierto && (
        <Carrito
          carrito={carrito} subtotal={subtotal}
          onCerrar={() => setCarritoAbierto(false)}
          onCambiar={cambiarCantidad}
          onEliminar={eliminarDelCarrito}
          onWhatsApp={pedidoWhatsApp}
          negocioId={negocio.id}
          negocioNombre={negocio.nombre}
        />
      )}
      <ChatNegocio negocio={negocio} />

      <Footer />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}

export default TiendaPage