const BASE_URL = 'http://localhost:3001/api'

const apiFetch = async (path, token, options = {}) => {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res  = await fetch(`${BASE_URL}${path}`, { headers, ...options })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

const descuento = (precio, oferta) => Math.round((precio - oferta) / precio * 100)

function ProductoCard({ p, navigate, token, favoritos, onToggleFav }) {
  const esFav   = favoritos.includes(p.producto_id)
  const pctDesc = p.precio_oferta ? descuento(p.precio, p.precio_oferta) : null

  const handleVer = async () => {
    if (token) {
      try {
        await apiFetch('/cuenta/vistos', token, {
          method: 'POST',
          body: JSON.stringify({ producto_id: p.producto_id })
        })
      } catch {}
    }
    navigate(`/tienda/${p.negocio_id}`)
  }

  return (
    <div
      className="shrink-0 w-44 md:w-52 bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:shadow-md transition-all group cursor-pointer"
      onClick={handleVer}
    >
      <div className="relative h-36 overflow-hidden bg-[#F3F4F6]">
        {p.img
          ? <img src={p.img} alt={p.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-full flex items-center justify-center"><i className="ri-image-line text-3xl text-[#D1D5DB]" /></div>
        }
        {pctDesc && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{pctDesc}%
          </span>
        )}
        {token && (
          <button
            onClick={e => { e.stopPropagation(); onToggleFav(p.producto_id) }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center cursor-pointer hover:scale-110 transition-all"
          >
            <i className={`${esFav ? 'ri-heart-fill text-red-500' : 'ri-heart-line text-[#9CA3AF]'} text-sm`} />
          </button>
        )}
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5">
          <span className="text-[9px] font-semibold text-[#374151] truncate max-w-[80px] block">{p.negocio_nombre}</span>
        </div>
      </div>
      <div className="p-3">
        <p className="text-xs font-bold text-[#111827] truncate">{p.nombre}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-black text-[#0D9488]">S/ {Number(p.precio_oferta || p.precio).toFixed(2)}</span>
          {p.precio_oferta && <span className="text-[10px] text-[#9CA3AF] line-through">S/ {Number(p.precio).toFixed(2)}</span>}
        </div>
        {pctDesc && <p className="text-[10px] text-green-600 font-semibold mt-0.5">Ahorras S/ {(p.precio - p.precio_oferta).toFixed(2)}</p>}
        <button className="mt-2 w-8 h-8 rounded-full bg-[#111827] flex items-center justify-center ml-auto hover:bg-[#374151] transition-all">
          <i className="ri-arrow-right-line text-white text-xs" />
        </button>
      </div>
    </div>
  )
}

export default ProductoCard