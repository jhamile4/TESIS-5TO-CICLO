function TiendaHero({ negocio, imgActiva, setImgActiva, totalItems, onAbrirCarrito }) {
  return (
    <div className="w-full bg-[#111827] relative">
      {/* Imagen principal */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img
          src={negocio.galeria[imgActiva]}
          alt={negocio.nombre}
          className="w-full h-full object-cover opacity-70 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Info sobre imagen */}
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 max-w-7xl mx-auto">
          <span className="inline-block bg-[#0D9488] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
            {negocio.categoria}
          </span>
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{negocio.nombre}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <i className="ri-star-fill text-amber-400 text-sm" />
              {negocio.rating} <span className="text-white/40">({negocio.resenas} reseñas)</span>
            </span>
            {negocio.direccion && (
              <span className="flex items-center gap-1.5">
                <i className="ri-map-pin-line text-sm" />
                {negocio.direccion}
              </span>
            )}
            {negocio.horario && (
              <span className="flex items-center gap-1.5">
                <i className="ri-time-line text-sm" />
                {negocio.horario}
              </span>
            )}
          </div>
        </div>

        {/* Botón carrito flotante */}
        {totalItems > 0 && (
          <button
            onClick={onAbrirCarrito}
            className="absolute top-4 right-4 md:top-6 md:right-6 bg-[#0D9488] text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg cursor-pointer hover:bg-[#0F766E] transition-all"
          >
            <i className="ri-shopping-cart-2-line text-lg" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          </button>
        )}
      </div>

      {/* Galería de miniaturas */}
      {negocio.galeria.length > 1 && (
        <div className="flex gap-2 p-3 md:p-4 bg-[#0a0a0a] overflow-x-auto no-scrollbar max-w-7xl mx-auto">
          {negocio.galeria.map((img, i) => (
            <button
              key={i}
              onClick={() => setImgActiva(i)}
              className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden cursor-pointer transition-all border-2 ${
                i === imgActiva ? 'border-[#0D9488] opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              <img src={img} alt={`foto ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default TiendaHero