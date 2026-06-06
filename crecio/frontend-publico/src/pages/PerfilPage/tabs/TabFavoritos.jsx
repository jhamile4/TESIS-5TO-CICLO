function TabFavoritos({ favData, navigate, onToggleFav }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-black text-[#111827]">Favoritos</h2>
      {favData.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center">
          <i className="ri-heart-line text-5xl text-[#E5E7EB] block mb-3" />
          <p className="text-sm text-[#9CA3AF] mb-4">Toca el corazón en cualquier producto para guardarlo aquí.</p>
          <button onClick={() => navigate('/')} className="px-6 py-2.5 rounded-xl bg-[#0D9488] text-white font-semibold text-xs cursor-pointer">
            Explorar tiendas
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
          <p className="text-xs text-[#9CA3AF] mb-4">{favData.length} producto(s) guardados</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {favData.map((p, i) => (
              <div key={i} className="bg-[#FAFAFA] rounded-xl border border-[#E5E7EB] overflow-hidden hover:shadow-sm transition-all cursor-pointer group"
                onClick={() => navigate(`/tienda/${p.negocio_id}`)}>
                <div className="relative h-32 overflow-hidden bg-[#F3F4F6]">
                  {p.img
                    ? <img src={p.img} alt={p.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full flex items-center justify-center"><i className="ri-image-line text-3xl text-[#D1D5DB]" /></div>
                  }
                  <button onClick={e => { e.stopPropagation(); onToggleFav(p.producto_id) }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center cursor-pointer">
                    <i className="ri-heart-fill text-red-500 text-sm" />
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-[#9CA3AF] truncate">{p.negocio_nombre}</p>
                  <p className="text-xs font-bold text-[#111827] truncate mt-0.5">{p.nombre}</p>
                  <p className="text-sm font-black text-[#0D9488] mt-1">S/ {Number(p.precio_oferta || p.precio).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TabFavoritos