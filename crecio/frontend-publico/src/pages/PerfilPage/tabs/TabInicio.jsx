import ProductoCard from '../components/ProductoCard'
import PedidoRow   from '../components/PedidoRow'

const formatFecha = (iso) => new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })

function TabInicio({ perfil, pedidos, ofertas, carritoAbandonado, vistos, tiendas,
  pagados, pendientes, navigate, token, favoritos, onToggleFav, onVerTab }) {

  const initials = perfil?.nombre?.split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase() || '?'
  const nombre   = perfil?.nombre?.split(' ')[0] || ''

  return (
    <div className="space-y-6">

      {/* Bienvenida */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#0D9488]/10 flex items-center justify-center shrink-0">
          <span className="text-lg font-bold text-[#0D9488]">{initials}</span>
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold text-[#111827]">Hola, {nombre} 👋</h2>
          <p className="text-xs text-[#9CA3AF] mt-0.5">{pagados} pedidos entregados · Miembro desde {formatFecha(perfil?.created_at)}</p>
        </div>
        <button onClick={() => onVerTab('datos')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111827] text-white text-xs font-bold cursor-pointer hover:bg-[#374151] transition-all shrink-0">
          <i className="ri-settings-3-line text-xs" /> Mis Datos
        </button>
      </div>

      {/* Ofertas del día */}
      {ofertas.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center relative">
              <i className="ri-fire-line text-red-500 text-sm" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111827]">Ofertas del día</h3>
              <p className="text-[10px] text-[#9CA3AF]">Descuentos exclusivos en tus tiendas</p>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {ofertas.map((p, i) => <ProductoCard key={i} p={p} navigate={navigate} token={token} favoritos={favoritos} onToggleFav={onToggleFav} />)}
          </div>
        </div>
      )}

      {/* Carrito abandonado */}
      {carritoAbandonado.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-[#0D9488]/10 flex items-center justify-center">
              <i className="ri-shopping-cart-line text-[#0D9488] text-sm" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111827]">Seguí donde lo dejaste</h3>
              <p className="text-[10px] text-[#9CA3AF]">{carritoAbandonado.length} producto(s) esperando en tu carrito</p>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {carritoAbandonado.map((p, i) => (
              <div key={i} className="shrink-0 w-44 bg-[#FAFAFA] rounded-xl border border-[#E5E7EB] overflow-hidden cursor-pointer hover:shadow-sm transition-all group"
                onClick={() => navigate(`/tienda/${p.negocio_id}`)}>
                <div className="relative h-28 overflow-hidden bg-[#F3F4F6]">
                  {p.img ? <img src={p.img} alt={p.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full flex items-center justify-center"><i className="ri-image-line text-3xl text-[#D1D5DB]" /></div>}
                  <div className="absolute bottom-2 left-2 bg-white/90 rounded-full px-2 py-0.5">
                    <span className="text-[9px] font-semibold text-[#374151] truncate max-w-[80px] block">{p.negocio_nombre}</span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-bold text-[#111827] truncate">{p.nombre}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-black text-[#0D9488]">S/ {Number(p.precio).toFixed(2)}</span>
                    <span className="text-[10px] text-[#9CA3AF]">x{p.cantidad}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/')} className="mt-3 w-full py-2.5 rounded-xl border border-[#0D9488] text-[#0D9488] text-xs font-bold hover:bg-[#0D9488]/5 transition-all cursor-pointer">
            Continuar comprando →
          </button>
        </div>
      )}

      {/* Vistos recientemente */}
      {vistos.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <i className="ri-history-line text-amber-500 text-sm" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111827]">Productos que exploraste</h3>
              <p className="text-[10px] text-[#9CA3AF]">Últimas tiendas que visitaste</p>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {vistos.map((p, i) => <ProductoCard key={i} p={p} navigate={navigate} token={token} favoritos={favoritos} onToggleFav={onToggleFav} />)}
          </div>
        </div>
      )}

      {/* Resumen pedidos */}
      {pedidos.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#F3F4F6]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-bold bg-[#111827] text-white px-3 py-1 rounded-full">
                <i className="ri-file-list-3-line text-[10px]" />{pedidos.length} pedidos
              </span>
              {pendientes > 0 && <span className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full">{pendientes} en curso</span>}
              {pagados > 0 && <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">{pagados} entregados</span>}
            </div>
            <button onClick={() => onVerTab('pedidos')} className="text-xs text-[#0D9488] font-semibold cursor-pointer hover:underline shrink-0">Ver todos →</button>
          </div>
          {pedidos.slice(0,3).map((p, i) => <PedidoRow key={i} pedido={p} navigate={navigate} />)}
        </div>
      )}

      {/* Tus tiendas */}
      {tiendas.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-[#0D9488]/10 flex items-center justify-center">
              <i className="ri-store-2-line text-[#0D9488] text-sm" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111827]">Tus tiendas</h3>
              <p className="text-[10px] text-[#9CA3AF]">Donde ya compraste</p>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
            {tiendas.map((t, i) => (
              <div key={i} className="shrink-0 flex flex-col items-center gap-2 cursor-pointer group" onClick={() => navigate(`/tienda/${t.id}`)}>
                {t.logo
                  ? <img src={t.logo} alt={t.nombre} className="w-16 h-16 rounded-2xl object-cover border-2 border-[#E5E7EB] group-hover:border-[#0D9488] transition-all" />
                  : <div className="w-16 h-16 rounded-2xl bg-[#0D9488]/10 flex items-center justify-center border-2 border-[#E5E7EB] group-hover:border-[#0D9488] transition-all">
                      <i className="ri-store-2-line text-[#0D9488] text-xl" />
                    </div>
                }
                <p className="text-[10px] font-semibold text-[#374151] text-center max-w-[70px] truncate">{t.nombre}</p>
                <span className="text-[10px] text-[#0D9488] font-semibold group-hover:underline">Ver tienda →</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TabInicio