import PedidoRow from '../components/PedidoRow'

function TabPedidos({ pedidos, pagados, pendientes, navigate }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-black text-[#111827]">Mis pedidos</h2>
      {pedidos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center">
          <i className="ri-shopping-bag-line text-5xl text-[#E5E7EB] block mb-3" />
          <h3 className="text-sm font-bold text-[#111827] mb-2">Aún no tienes pedidos</h3>
          <button onClick={() => navigate('/')} className="px-6 py-2.5 rounded-xl bg-[#0D9488] text-white font-semibold text-xs cursor-pointer hover:bg-[#0F766E] transition-all">
            Explorar tiendas
          </button>
        </div>
      ) : (
        <>
          {pendientes > 0 && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 bg-amber-50 border-b border-amber-100">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block animate-pulse" />
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">En curso · {pendientes}</span>
              </div>
              {pedidos.filter(p => p.estado === 'pendiente').map((p, i) => <PedidoRow key={i} pedido={p} navigate={navigate} detalle />)}
            </div>
          )}
          {pagados > 0 && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 bg-green-50 border-b border-green-100">
                <i className="ri-checkbox-circle-line text-green-500 text-sm" />
                <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Entregados · {pagados}</span>
              </div>
              {pedidos.filter(p => p.estado === 'pagado').map((p, i) => <PedidoRow key={i} pedido={p} navigate={navigate} detalle />)}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default TabPedidos