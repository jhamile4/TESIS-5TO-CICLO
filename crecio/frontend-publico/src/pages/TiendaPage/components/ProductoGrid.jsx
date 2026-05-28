function ProductoGrid({ productos, onAgregar, whatsapp, waBase }) {
  if (productos.length === 0) return (
    <div className="text-center py-16 text-[#9CA3AF]">
      <div className="w-12 h-12 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-3">
        <i className="ri-shopping-bag-line text-xl" />
      </div>
      <p className="text-sm">Este negocio aún no publicó productos.</p>
    </div>
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {productos.map((p, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden hover:border-[#0D9488]/20 transition-all group"
        >
          {/* Imagen */}
          <div className="relative h-40 overflow-hidden bg-[#F3F4F6]">
            {p.img
              ? <img src={p.img} alt={p.nombre} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
              : <div className="w-full h-full flex items-center justify-center"><i className="ri-image-line text-3xl text-[#D1D5DB]" /></div>
            }
            <div className="absolute top-2 right-2">
              <span className="bg-[#111827] text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                S/ {Number(p.precio).toFixed(2)}
              </span>
            </div>
            {p.stock === 0 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-white text-[#374151] text-xs font-bold px-3 py-1.5 rounded-full">Agotado</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4">
            <h4 className="font-bold text-[#111827] text-sm mb-1">{p.nombre}</h4>
            {p.desc && <p className="text-xs text-[#6B7280] mb-3 leading-relaxed line-clamp-2">{p.desc}</p>}

            <div className="flex items-center gap-2">
              <button
                onClick={() => onAgregar(p)}
                disabled={p.stock === 0}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#111827] hover:bg-[#374151] disabled:opacity-50 text-white rounded-lg font-semibold text-xs transition-all cursor-pointer"
              >
                <i className="ri-add-line text-sm" />
                Agregar al carrito
              </button>
              <a
                href={`${waBase}: Quiero pedir ${encodeURIComponent(p.nombre)} (S/ ${Number(p.precio).toFixed(2)})`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#0D9488] hover:bg-[#0F766E] text-white rounded-lg font-semibold text-xs transition-all cursor-pointer"
              >
                <i className="ri-whatsapp-line text-sm" />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductoGrid