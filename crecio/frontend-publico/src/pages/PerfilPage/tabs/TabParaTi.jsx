import { useState, useEffect } from 'react'

const BASE_URL = 'http://localhost:3001/api'

function CardProducto({ p, badge, badgeColor, navigate }) {
  return (
    <div
      className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden cursor-pointer hover:shadow-md transition-all group"
      onClick={() => navigate(`/tienda/${p.negocio_id}`)}
    >
      {/* Imagen */}
      <div className="relative h-40 overflow-hidden bg-[#F3F4F6]">
        {p.img
          ? <img src={p.img} alt={p.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-full flex items-center justify-center"><i className="ri-image-line text-4xl text-[#D1D5DB]" /></div>
        }
        <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${badgeColor}`}>
          {badge}
        </span>
      </div>

      {/* Info */}
      <div className="p-3.5">
        <p className="text-[10px] font-semibold text-[#0D9488] uppercase tracking-wide truncate">{p.categoria}</p>
        <p className="text-sm font-bold text-[#111827] truncate mt-0.5 leading-snug">{p.nombre}</p>
        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-[#111827]">
              S/ {Number(p.precio_oferta || p.precio).toFixed(2)}
            </span>
            {p.precio_oferta && (
              <span className="text-[10px] text-[#9CA3AF] line-through">S/ {Number(p.precio).toFixed(2)}</span>
            )}
          </div>
          <div className="w-8 h-8 rounded-full bg-[#111827] flex items-center justify-center shrink-0 group-hover:bg-[#0D9488] transition-colors">
            <i className="ri-arrow-right-line text-white text-sm" />
          </div>
        </div>
      </div>
    </div>
  )
}

function TabParaTi({ paraTi, navigate }) {
  const [modo,       setModo]       = useState('similar')
  const [economicos, setEconomicos] = useState([])
  const [cargando,   setCargando]   = useState(false)

  useEffect(() => {
    if (modo !== 'economico' || economicos.length > 0) return
    setCargando(true)
    const token = localStorage.getItem('token_comprador')
    fetch(`${BASE_URL}/cuenta/para-ti/economico`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => setEconomicos(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setCargando(false))
  }, [modo])

  const productos = modo === 'similar' ? paraTi : economicos
  const badge     = modo === 'similar'
    ? { text: 'Similar',       color: 'bg-[#0D9488] text-white' }
    : { text: 'Más económico', color: 'bg-amber-400 text-white' }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#0D9488]/10 flex items-center justify-center">
          <i className="ri-magic-line text-[#0D9488] text-sm" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-[#111827]">Para ti</h2>
          <p className="text-[10px] text-[#9CA3AF]">Sugerencias basadas en lo que te gusta</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setModo('similar')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            modo === 'similar'
              ? 'bg-[#111827] text-white'
              : 'bg-white border border-[#E5E7EB] text-[#374151] hover:border-[#0D9488] hover:text-[#0D9488]'
          }`}
        >
          <i className="ri-sparkling-line text-[10px]" /> También te podría gustar
        </button>
        <button
          onClick={() => setModo('economico')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            modo === 'economico'
              ? 'bg-[#111827] text-white'
              : 'bg-white border border-[#E5E7EB] text-[#374151] hover:border-[#0D9488] hover:text-[#0D9488]'
          }`}
        >
          <i className="ri-price-tag-3-line text-[10px]" /> Similares por menos
        </button>
      </div>

      {/* Grid */}
      {cargando ? (
        <div className="grid grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden animate-pulse">
              <div className="h-40 bg-[#F3F4F6]" />
              <div className="p-3.5 space-y-2">
                <div className="h-2.5 bg-[#F3F4F6] rounded w-1/2" />
                <div className="h-3 bg-[#F3F4F6] rounded w-3/4" />
                <div className="h-4 bg-[#F3F4F6] rounded w-1/3 mt-3" />
              </div>
            </div>
          ))}
        </div>
      ) : productos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center">
          <i className="ri-magic-line text-5xl text-[#E5E7EB] block mb-3" />
          <p className="text-sm text-[#9CA3AF]">
            {paraTi.length === 0
              ? 'Realiza tu primer pedido para recibir recomendaciones.'
              : 'No encontramos opciones en este momento.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {productos.map((p, i) => (
            <CardProducto
              key={i}
              p={p}
              badge={badge.text}
              badgeColor={badge.color}
              navigate={navigate}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default TabParaTi
