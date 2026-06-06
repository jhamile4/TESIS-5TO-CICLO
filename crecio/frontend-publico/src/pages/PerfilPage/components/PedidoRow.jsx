import { useState } from 'react'

function PedidoRow({ pedido: p, navigate, detalle }) {
  const [expandido, setExpandido] = useState(false)
  const items     = typeof p.items === 'string' ? JSON.parse(p.items) : p.items
  const cantItems = items?.reduce((a, i) => a + i.cantidad, 0) || 0

  return (
    <div className="border-b border-[#F3F4F6] last:border-0">
      <div
        className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-[#FAFAFA] transition-colors"
        onClick={() => detalle && setExpandido(!expandido)}
      >
        <div className="w-10 h-10 rounded-xl bg-[#0D9488]/10 flex items-center justify-center shrink-0">
          <i className={`text-sm ${p.estado === 'pagado' ? 'ri-checkbox-circle-line text-green-500' : 'ri-time-line text-amber-500'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#111827]">
            Pedido #{p.numero_pedido || p.pk_id?.toString().slice(0,8)}
          </p>
          <p className="text-xs text-[#9CA3AF]">
            {cantItems} producto{cantItems !== 1 ? 's' : ''} · {new Date(p.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-[#111827]">S/ {Number(p.monto_total).toFixed(2)}</p>
          <p className={`text-[10px] font-semibold ${p.estado === 'pagado' ? 'text-green-600' : 'text-amber-600'}`}>
            {p.estado === 'pagado' ? 'Entregado' : 'Pendiente de pago'}
          </p>
        </div>
        {detalle && <i className={`ri-arrow-down-s-line text-[#9CA3AF] transition-transform ${expandido ? 'rotate-180' : ''}`} />}
      </div>

      {expandido && detalle && (
        <div className="px-5 pb-4 space-y-2 bg-[#FAFAFA]">
          {items?.map((item, j) => (
            <div key={j} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-white border border-[#E5E7EB] flex items-center justify-center text-[10px] font-bold text-[#6B7280]">{item.cantidad}</span>
                <span className="text-[#374151]">{item.nombre}</span>
              </div>
              <span className="text-[#6B7280]">S/ {(item.precio * item.cantidad).toFixed(2)}</span>
            </div>
          ))}
          {p.negocio_whatsapp && (
            <a href={`https://wa.me/${p.negocio_whatsapp}`} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#22C55E] hover:underline mt-1">
              <i className="ri-whatsapp-line" />Contactar negocio
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default PedidoRow