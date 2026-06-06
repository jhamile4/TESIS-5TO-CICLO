function TabTiendas({ tiendas, pedidos, navigate }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-black text-[#111827]">Tus tiendas</h2>
      {tiendas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center">
          <i className="ri-store-2-line text-5xl text-[#E5E7EB] block mb-3" />
          <p className="text-sm text-[#9CA3AF] mb-4">Aún no has comprado en ninguna tienda.</p>
          <button onClick={() => navigate('/')} className="px-6 py-2.5 rounded-xl bg-[#0D9488] text-white font-semibold text-xs cursor-pointer">
            Ver negocios
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tiendas.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex items-center gap-4 hover:border-[#0D9488]/30 transition-all cursor-pointer group"
              onClick={() => navigate(`/tienda/${t.id}`)}>
              {t.logo
                ? <img src={t.logo} alt={t.nombre} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                : <div className="w-14 h-14 rounded-xl bg-[#0D9488]/10 flex items-center justify-center shrink-0">
                    <i className="ri-store-2-line text-[#0D9488] text-xl" />
                  </div>
              }
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-[#111827] truncate">{t.nombre}</h4>
                <p className="text-xs text-[#9CA3AF] mt-0.5">
                  {pedidos.filter(p => p.negocio_id === t.id).length} compra(s) realizadas
                </p>
                <span className="text-xs text-[#0D9488] font-semibold group-hover:underline">Ver tienda →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TabTiendas