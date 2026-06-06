function TabParaTi({ paraTi, navigate, favoritos, onToggleFav }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-black text-[#111827]">Para vos</h2>
      <p className="text-xs text-[#9CA3AF]">Sugerencias basadas en lo que te gusta</p>
      {paraTi.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center">
          <i className="ri-magic-line text-5xl text-[#E5E7EB] block mb-3" />
          <p className="text-sm text-[#9CA3AF]">Realiza tu primer pedido para recibir recomendaciones.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {paraTi.map((p, i) => (
              <div key={i} className="bg-[#FAFAFA] rounded-xl border border-[#E5E7EB] overflow-hidden hover:shadow-sm transition-all cursor-pointer group relative"
                onClick={() => navigate(`/tienda/${p.negocio_id}`)}>
                <span className="absolute top-2 left-2 z-10 text-[9px] font-bold bg-[#0D9488] text-white px-2 py-0.5 rounded-full">Similar</span>
                <div className="relative h-32 overflow-hidden bg-[#F3F4F6]">
                  {p.img
                    ? <img src={p.img} alt={p.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full flex items-center justify-center"><i className="ri-image-line text-3xl text-[#D1D5DB]" /></div>
                  }
                  <button onClick={e => { e.stopPropagation(); onToggleFav(p.producto_id) }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center cursor-pointer">
                    <i className={`${favoritos.includes(p.producto_id) ? 'ri-heart-fill text-red-500' : 'ri-heart-line text-[#9CA3AF]'} text-sm`} />
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-[10px] font-semibold text-[#9CA3AF] truncate">{p.categoria}</p>
                  <p className="text-xs font-bold text-[#111827] truncate mt-0.5">{p.nombre}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-black text-[#0D9488]">S/ {Number(p.precio_oferta || p.precio).toFixed(2)}</span>
                    {p.precio_oferta && <span className="text-[10px] text-[#9CA3AF] line-through">S/ {Number(p.precio).toFixed(2)}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TabParaTi