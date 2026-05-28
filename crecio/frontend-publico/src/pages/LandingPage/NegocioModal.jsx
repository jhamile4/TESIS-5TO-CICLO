import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProductos, getResenas } from '../../services/apiPublico'

function NegocioModal({ negocio, onClose }) {
  const navigate  = useNavigate()
  const modalRef  = useRef(null)
  const [tabActivo, setTabActivo]   = useState('productos')
  const [activeImg, setActiveImg]   = useState(0)
  const [productos, setProductos]   = useState([])
  const [resenas, setResenas]       = useState([])
  const [cargando, setCargando]     = useState(true)

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  useEffect(() => {
    setCargando(true)
    setTabActivo('productos')
    setActiveImg(0)
    Promise.all([getProductos(negocio.id), getResenas(negocio.id)])
      .then(([prods, rese]) => { setProductos(prods); setResenas(rese); setCargando(false) })
      .catch(() => setCargando(false))
  }, [negocio.id])

  const galeria = negocio.galeria?.length > 0 ? negocio.galeria : [negocio.img]
  const waLink  = `https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent(`Hola ${negocio.nombre}, te encontré en CRECIO y quiero hacer un pedido`)}`

  const goToStore = () => { onClose(); navigate(`/tienda/${negocio.id}`) }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      onClick={(e) => { if (modalRef.current && !modalRef.current.contains(e.target)) onClose() }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-3xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl no-scrollbar"
        style={{ animation: 'modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >

        {/* ── Hero imagen + galería encima ── */}
        <div className="relative">
          <img
            src={galeria[activeImg]}
            alt={negocio.nombre}
            className="w-full h-56 object-cover object-top rounded-t-3xl transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70 rounded-t-3xl" />

          {/* Cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/95 rounded-full cursor-pointer hover:bg-white transition-all shadow-lg"
          >
            <i className="ri-close-line text-[#111827] text-lg" />
          </button>

          {/* Badge verificado */}
          {negocio.verificado && (
            <div className="absolute top-4 left-4">
              <span className="bg-white text-[#0D9488] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                <i className="ri-verified-badge-fill text-[#0D9488]" />
                Verificado CRECIO
              </span>
            </div>
          )}

          {/* Miniaturas galería */}
          {galeria.length > 1 && (
            <div className="absolute bottom-14 left-4 right-4 flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {galeria.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative w-12 h-9 rounded-md overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeImg === i ? 'border-white shadow-md' : 'border-white/40 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Categoría + rating overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2">
              <span className="bg-white/90 backdrop-blur-sm text-[#111827] text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                {negocio.categoria}
              </span>
              <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
                <i className="ri-star-fill text-amber-400 text-xs" />
                <span className="text-xs font-bold text-[#111827]">{negocio.rating}</span>
                <span className="text-xs text-[#9CA3AF]">({negocio.resenas})</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Contenido ── */}
        <div className="px-5 pt-5 pb-6">

          {/* Nombre y descripción */}
          <h2 className="text-2xl font-bold text-[#111827] leading-tight mb-2">{negocio.nombre}</h2>
          {negocio.desc && <p className="text-sm text-[#6B7280] leading-relaxed mb-4">{negocio.desc}</p>}

          {/* Info pills scroll horizontal */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 mb-5 -mx-1 px-1 no-scrollbar">
            {[
              { icon: 'ri-map-pin-2-line', label: 'Dirección', valor: negocio.direccion },
              { icon: 'ri-time-line',      label: 'Horario',   valor: negocio.horario   },
              { icon: 'ri-phone-line',     label: 'Teléfono',  valor: negocio.telefono  },
            ].filter(i => i.valor).map(item => (
              <div key={item.label} className="flex items-center gap-2 bg-[#FAFAFA] rounded-xl px-3.5 py-2.5 min-w-fit border border-[#E5E7EB]">
                <div className="w-8 h-8 flex items-center justify-center bg-[#0D9488]/10 rounded-lg shrink-0">
                  <i className={`${item.icon} text-[#0D9488] text-xs`} />
                </div>
                <div>
                  <p className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-wider">{item.label}</p>
                  <p className="text-xs text-[#111827] font-medium whitespace-nowrap">{item.valor}</p>
                </div>
              </div>
            ))}
          </div>



          {/* Tabs */}
          <div className="flex items-center gap-1 bg-[#F3F4F6] rounded-lg p-1 mb-4">
            {[
              { key: 'productos', label: `Productos (${productos.length})` },
              { key: 'resenas',   label: `Reseñas (${resenas.length})`     },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setTabActivo(t.key)}
                className={`flex-1 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  tabActivo === t.key
                    ? 'bg-white text-[#111827] shadow-sm'
                    : 'text-[#6B7280] hover:text-[#374151]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Contenido tabs */}
          {cargando ? (
            <div className="text-center py-8 text-[#9CA3AF] text-sm">
              <i className="ri-loader-4-line text-2xl animate-spin block mb-2 text-[#0D9488]" />
              Cargando...
            </div>
          ) : (
            <>
              {tabActivo === 'productos' && (
                <div className="flex flex-col gap-3 mb-5">
                  {productos.length === 0
                    ? <p className="text-sm text-center text-[#9CA3AF] py-6">Sin productos aún.</p>
                    : productos.map((p, i) => (
                        <div key={i} className="flex gap-3 bg-white rounded-xl border border-[#E5E7EB] p-3 hover:border-[#0D9488]/20 transition-all group">
                          {p.img
                            ? <img src={p.img} alt={p.nombre} className="w-20 h-20 rounded-lg object-cover shrink-0 group-hover:scale-105 transition-transform duration-500" />
                            : <div className="w-20 h-20 rounded-lg bg-[#F3F4F6] flex items-center justify-center shrink-0"><i className="ri-image-line text-[#D1D5DB] text-2xl" /></div>
                          }
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-bold text-[#111827] text-sm leading-snug">{p.nombre}</h4>
                                <span className="text-sm font-bold text-[#0D9488] shrink-0">S/ {p.precio}</span>
                              </div>
                              {p.desc && <p className="text-xs text-[#6B7280] mt-0.5 line-clamp-2">{p.desc}</p>}
                            </div>
                            <a
                              href={`${waLink}: Quiero pedir ${encodeURIComponent(p.nombre)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="self-start mt-1 text-xs font-semibold text-[#0D9488] hover:text-[#0F766E] flex items-center gap-1 transition-colors"
                            >
                              <i className="ri-whatsapp-line text-sm" />
                              Pedir por WhatsApp
                            </a>
                          </div>
                        </div>
                      ))
                  }
                </div>
              )}

              {tabActivo === 'resenas' && (
                <div className="flex flex-col gap-3 mb-5">
                  {resenas.length === 0
                    ? <p className="text-sm text-center text-[#9CA3AF] py-6">Sin reseñas aún.</p>
                    : resenas.slice(0, 3).map((r, i) => (
                        <div key={i} className="bg-white rounded-xl border border-[#E5E7EB] p-4">
                          <div className="flex items-start gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#0D9488]/10 flex items-center justify-center text-xs font-bold text-[#0D9488] shrink-0">
                              {r.nombre.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-0.5">
                                <h4 className="text-xs font-bold text-[#111827]">{r.nombre}</h4>
                                <span className="text-[10px] text-[#9CA3AF]">{r.tiempo}</span>
                              </div>
                              <div className="flex items-center gap-0.5 mb-1">
                                {Array.from({ length: 5 }).map((_, j) => (
                                  <i key={j} className={`ri-star-fill text-[10px] ${j < r.estrellas ? 'text-amber-400' : 'text-[#E5E7EB]'}`} />
                                ))}
                              </div>
                              <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-3">{r.texto}</p>
                            </div>
                          </div>
                        </div>
                      ))
                  }
                  {resenas.length > 3 && (
                    <p className="text-xs text-[#9CA3AF] text-center">+ {resenas.length - 3} reseñas más en la tienda</p>
                  )}
                </div>
              )}
            </>
          )}

          {/* Divisor */}
          <div className="border-t border-[#E5E7EB] my-5" />

          {/* Botones de acción */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={goToStore}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#111827] hover:bg-[#1F2937] text-white rounded-2xl font-bold text-sm transition-all cursor-pointer shadow-lg"
            >
              <i className="ri-store-2-line text-base" />
              Ver tienda completa
            </button>
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white border-2 border-[#E5E7EB] hover:border-green-400/50 hover:bg-green-50 text-[#111827] rounded-2xl font-bold text-sm transition-all cursor-pointer"
            >
              <i className="ri-whatsapp-line text-green-500 text-base" />
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default NegocioModal