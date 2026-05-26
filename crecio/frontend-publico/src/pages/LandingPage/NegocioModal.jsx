import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProductos, getResenas } from '../../services/apiPublico'

function NegocioModal({ negocio, onClose }) {
  const navigate = useNavigate()
  const [tabActivo, setTabActivo] = useState('productos')
  const [productos, setProductos] = useState([])
  const [resenas, setResenas]     = useState([])
  const [cargando, setCargando]   = useState(true)

  useEffect(() => {
    Promise.all([getProductos(negocio.id), getResenas(negocio.id)])
      .then(([prods, rese]) => { setProductos(prods); setResenas(rese); setCargando(false) })
      .catch(err => { console.error(err); setCargando(false) })
  }, [negocio.id])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors cursor-pointer"
        >
          <i className="ri-close-line text-sm text-[#374151]" />
        </button>

        {/* Imagen */}
        <div className="relative h-52 overflow-hidden rounded-t-2xl">
          <img src={negocio.img} alt={negocio.nombre} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {negocio.verificado && (
            <div className="absolute top-3 left-3">
              <span className="bg-[#0D9488] text-white text-xs font-medium px-2.5 py-1 rounded flex items-center gap-1">
                <i className="ri-shield-check-line text-xs" />
                Verificado CRECIO
              </span>
            </div>
          )}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span className="bg-white/90 text-[#374151] text-xs font-medium px-2.5 py-1 rounded">
              {negocio.categoria}
            </span>
            <span className="bg-black/40 text-white text-xs font-medium px-2.5 py-1 rounded flex items-center gap-1">
              <i className="ri-star-fill text-amber-400 text-[10px]" />
              {negocio.rating} ({negocio.resenas})
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-[#111827] mb-1">{negocio.nombre}</h3>
          <p className="text-sm text-[#6B7280] leading-relaxed mb-4">{negocio.desc}</p>

          {/* Info row */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { icon: 'ri-map-pin-line', label: 'DIRECCIÓN', value: negocio.direccion },
              { icon: 'ri-time-line',    label: 'HORARIO',   value: negocio.horario   },
              { icon: 'ri-phone-line',   label: 'TELÉFONO',  value: negocio.telefono  },
            ].map(item => (
              <div key={item.label} className="flex flex-col gap-1">
                <span className="text-[10px] font-bold tracking-wider text-[#9CA3AF]">{item.label}</span>
                <span className="text-xs text-[#374151] font-medium leading-tight">{item.value || '—'}</span>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-4 bg-[#F3F4F6] rounded-lg p-1">
            {[
              { key: 'productos', label: `Productos (${productos.length})` },
              { key: 'resenas',   label: `Reseñas (${resenas.length})`    },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setTabActivo(tab.key)}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  tabActivo === tab.key
                    ? 'bg-white text-[#0D9488] shadow-sm'
                    : 'text-[#6B7280] hover:text-[#374151]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Contenido tabs */}
          {cargando ? (
            <div className="text-center py-8 text-[#9CA3AF] text-sm">
              <i className="ri-loader-4-line text-2xl animate-spin block mb-2" />
              Cargando...
            </div>
          ) : (
            <>
              {tabActivo === 'productos' && (
                <div className="flex flex-col gap-3">
                  {productos.length === 0 && (
                    <p className="text-sm text-center text-[#9CA3AF] py-6">Sin productos aún.</p>
                  )}
                  {productos.map((p, i) => (
                    <div key={i} className="flex gap-3 items-center border border-[#E5E7EB] rounded-xl p-3">
                      {p.img && (
                        <img src={p.img} alt={p.nombre} className="w-14 h-14 object-cover rounded-lg shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-[#111827] truncate">{p.nombre}</div>
                        <div className="text-xs text-[#6B7280] truncate">{p.desc}</div>
                        <a
                          href={`https://wa.me/${negocio.whatsapp}?text=Hola, quiero pedir: ${p.nombre} S/${p.precio}`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-[#0D9488] hover:underline"
                        >
                          <i className="ri-whatsapp-line" />
                          Pedir por WhatsApp
                        </a>
                      </div>
                      <div className="shrink-0 text-sm font-bold text-[#0D9488]">S/ {p.precio}</div>
                    </div>
                  ))}
                </div>
              )}

              {tabActivo === 'resenas' && (
                <div className="flex flex-col gap-3">
                  {resenas.length === 0 && (
                    <p className="text-sm text-center text-[#9CA3AF] py-6">Sin reseñas aún.</p>
                  )}
                  {resenas.map((r, i) => (
                    <div key={i} className="border border-[#E5E7EB] rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-full bg-[#0D9488]/10 flex items-center justify-center text-xs font-bold text-[#0D9488]">
                          {r.nombre.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[#111827]">{r.nombre}</div>
                          <div className="text-[10px] text-amber-400">
                            {'★'.repeat(r.estrellas)}
                          </div>
                        </div>
                        <span className="ml-auto text-[10px] text-[#9CA3AF]">{r.tiempo}</span>
                      </div>
                      <p className="text-xs text-[#6B7280] leading-relaxed">{r.texto}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Acciones */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={() => { onClose(); navigate('/tienda/' + negocio.id) }}
              className="flex-1 py-3 bg-[#0D9488] hover:bg-[#0F766E] text-white rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <i className="ri-store-2-line" />
              Ver tienda completa
            </button>
            <a
              href={`https://wa.me/${negocio.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-3 border border-[#E5E7EB] hover:border-[#0D9488] text-[#374151] hover:text-[#0D9488] rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
            >
              <i className="ri-whatsapp-line text-[#0D9488]" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NegocioModal