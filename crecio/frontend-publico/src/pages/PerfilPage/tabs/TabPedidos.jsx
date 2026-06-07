import { useState } from 'react'

const BASE_URL = 'http://localhost:3001/api'

const formatFecha    = (iso) => new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
const formatFechaHora = (iso) => new Date(iso).toLocaleString('es-PE', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })

function numeroPedido(p) {
  return p.numero_pedido || (100100 + (p.pk_id % 9000))
}

function parseItems(raw) {
  if (Array.isArray(raw)) return raw
  try { return JSON.parse(raw) } catch { return [] }
}

function estadoConfig(estado) {
  if (estado === 'pagado')   return { label: 'Entregado',   color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200' }
  if (estado === 'efectivo') return { label: 'En curso',    color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200' }
  return                            { label: 'Pendiente',   color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200' }
}

/* ── Vista detalle ── */
function DetallePedido({ pedido: p, onVolver, navigate, perfil }) {
  const items    = parseItems(p.items)
  const subtotal = items.reduce((s, i) => s + i.precio * i.cantidad, 0)
  const envio    = Math.round((Number(p.monto_total) - subtotal) * 100) / 100
  const metodo   = p.stripe_payment_intent ? 'Tarjeta (Stripe)' : 'Pago en efectivo'
  const numPed   = numeroPedido(p)
  const cfg      = estadoConfig(p.estado)
  const esEfectivo  = p.estado === 'efectivo'
  const esPendiente = p.estado === 'pendiente'
  const enCurso     = esEfectivo || esPendiente

  const pasos = [
    { icon: 'ri-file-list-3-line', titulo: 'Pedido recibido',  sub: 'Estamos procesando tu orden', hecho: true },
    { icon: 'ri-bank-card-line',   titulo: 'Pago confirmado',  sub: 'Tu pago fue verificado',       hecho: p.estado === 'pagado' || !!p.stripe_payment_intent },
    { icon: 'ri-home-4-line',      titulo: '¡Entregado!',       sub: 'Disfruta tu compra',           hecho: p.estado === 'pagado' },
  ]

  const inicial = perfil?.nombre?.charAt(0).toUpperCase() || '?'

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button onClick={onVolver}
          className="w-8 h-8 rounded-full border border-[#E5E7EB] flex items-center justify-center hover:bg-[#F3F4F6] transition-all cursor-pointer shrink-0 mt-0.5">
          <i className="ri-arrow-left-line text-sm text-[#374151]" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold text-[#111827]">Pedido #{numPed}</h2>
            <span className="text-[10px] font-mono text-[#9CA3AF] bg-[#F3F4F6] px-2 py-0.5 rounded-full flex items-center gap-1">
              <i className="ri-file-copy-line" /> CRECIO-{numPed}
            </span>
          </div>
          <p className="text-xs text-[#9CA3AF] mt-0.5">{formatFechaHora(p.created_at)}</p>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full border shrink-0 ${cfg.color} ${cfg.bg} ${cfg.border}`}>
          {cfg.label}
        </span>
      </div>

      {/* Seguimiento */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
        <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider flex items-center gap-1.5 mb-4">
          <i className="ri-map-pin-time-line text-[#0D9488]" /> Seguimiento del pedido
        </p>
        <div className="flex flex-col gap-2">
          {pasos.map((paso, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${paso.hecho ? 'bg-[#0D9488]' : 'bg-[#F3F4F6] border border-[#E5E7EB]'}`}>
                  {paso.hecho
                    ? <i className={`${i === 2 ? paso.icon : 'ri-check-line'} text-white text-xs`} />
                    : <i className={`${paso.icon} text-[#D1D5DB] text-xs`} />
                  }
                </div>
                {i < pasos.length - 1 && (
                  <div className={`w-0.5 h-6 mt-1 ${pasos[i + 1].hecho ? 'bg-[#0D9488]' : 'bg-[#E5E7EB]'}`} />
                )}
              </div>
              <div className={`flex-1 flex items-start justify-between rounded-xl px-4 py-2.5 mb-2 ${paso.hecho ? 'bg-[#F0FDF9] border border-[#D1FAE5]' : 'bg-[#F9FAFB] border border-[#F3F4F6]'}`}>
                <div>
                  <p className={`text-sm font-bold ${paso.hecho ? 'text-[#111827]' : 'text-[#9CA3AF]'}`}>{paso.titulo}</p>
                  <p className="text-[10px] text-[#9CA3AF] mt-0.5">{paso.sub}</p>
                </div>
                {paso.hecho && i === pasos.filter(x => x.hecho).length - 1 && (
                  <span className="text-[10px] font-bold text-[#0D9488] bg-[#0D9488]/10 px-2 py-0.5 rounded-full shrink-0 ml-2 mt-0.5">Ahora</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Aviso pago en efectivo — solo informativo para el cliente */}
      {esEfectivo && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <i className="ri-hand-coin-line text-amber-500 text-lg shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-700">Pago en efectivo al recibir</p>
            <p className="text-xs text-amber-600 mt-0.5">
              El delivery pasará por tu dirección. Ten el dinero listo — pagas S/ {Number(p.monto_total).toFixed(2)} al momento de la entrega.
            </p>
          </div>
        </div>
      )}

      {/* Datos entrega + Resumen pago */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4">
          <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <i className="ri-user-line text-[#0D9488]" /> Datos de entrega
          </p>
          {perfil && (
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#0D9488]/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-[#0D9488]">{inicial}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-[#111827]">{perfil.nombre}</p>
                <p className="text-[10px] text-[#9CA3AF]">{perfil.email}</p>
              </div>
            </div>
          )}
          {p.direccion ? (
            <div className="flex flex-col gap-1 text-xs">
              <div className="flex items-start gap-1.5 text-[#374151]">
                <i className="ri-map-pin-line text-[#9CA3AF] shrink-0 mt-0.5" />
                <span>{[p.direccion, p.ciudad].filter(Boolean).join(', ')}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#9CA3AF]">Sin datos de entrega registrados</p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4">
          <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <i className="ri-receipt-line text-[#0D9488]" /> Resumen de pago
          </p>
          <div className="flex flex-col gap-1.5 text-xs">
            <div className="flex justify-between">
              <span className="flex items-center gap-1 text-[#6B7280]"><i className="ri-bank-card-line text-[10px]" /> Método</span>
              <span className="font-semibold text-[#374151]">{metodo}</span>
            </div>
            <div className="flex justify-between text-[#6B7280]">
              <span>Subtotal</span><span>S/ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#6B7280]">
              <span>Envío</span>
              <span className={envio === 0 ? 'text-[#0D9488] font-semibold' : ''}>{envio === 0 ? 'Gratis' : `S/ ${envio.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-[#111827] border-t border-[#E5E7EB] pt-1.5 mt-1">
              <span>Total</span>
              <span className="text-[#0D9488]">S/ {Number(p.monto_total).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Productos */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#F3F4F6]">
          <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider flex items-center gap-1.5">
            <i className="ri-shopping-bag-line text-[#0D9488]" /> Productos ({items.length})
          </p>
          <i className="ri-arrow-up-s-line text-[#9CA3AF]" />
        </div>
        <div className="divide-y divide-[#F3F4F6]">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3">
              <div className="w-9 h-9 rounded-lg bg-[#0D9488]/10 flex items-center justify-center shrink-0 overflow-hidden">
                {item.img
                  ? <img src={item.img} alt={item.nombre} className="w-full h-full object-cover" />
                  : <i className="ri-shopping-bag-line text-[#0D9488] text-sm" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#111827] truncate">{item.nombre}</p>
                <p className="text-[10px] text-[#9CA3AF]">x{item.cantidad} · S/ {Number(item.precio).toFixed(2)} c/u</p>
              </div>
              <span className="text-sm font-bold text-[#111827] shrink-0">S/ {(item.precio * item.cantidad).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Botón comprar de nuevo */}
      <button onClick={() => navigate(`/tienda/${p.negocio_id}`)}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#111827] hover:bg-[#374151] text-white font-bold text-sm cursor-pointer transition-all">
        <i className="ri-refresh-line" /> Comprar de nuevo
      </button>

      {/* Notas del pedido */}
      {p.notas && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4">
          <p className="text-xs font-bold text-[#374151] mb-1">Notas del pedido</p>
          <p className="text-xs text-[#6B7280]">{p.notas}</p>
        </div>
      )}
    </div>
  )
}

/* ── Vista lista ── */
function FilaPedido({ p, expandidoId, setExpandidoId, onVerDetalle }) {
  const items    = parseItems(p.items)
  const cantItem = items.reduce((a, i) => a + i.cantidad, 0)
  const numPed   = numeroPedido(p)
  const cfg      = estadoConfig(p.estado)
  const abierto  = expandidoId === p.pk_id

  return (
    <div className="border-b border-[#F3F4F6] last:border-0">
      <div className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-[#FAFAFA] transition-colors"
        onClick={() => setExpandidoId(abierto ? null : p.pk_id)}>
        <div className="w-9 h-9 rounded-xl bg-[#0D9488]/10 flex items-center justify-center shrink-0">
          <i className="ri-home-4-line text-[#0D9488] text-sm" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#111827]">Pedido #{numPed}</p>
          <p className="text-xs text-[#9CA3AF]">
            {cantItem} producto{cantItem !== 1 ? 's' : ''} · {formatFecha(p.created_at)}
          </p>
        </div>
        <div className="text-right shrink-0 mr-2">
          <p className="text-sm font-bold text-[#111827]">S/ {Number(p.monto_total).toFixed(2)}</p>
          <p className={`text-[10px] font-semibold ${cfg.color}`}>{cfg.label}</p>
        </div>
        <i className={`ri-arrow-down-s-line text-[#9CA3AF] text-lg transition-transform duration-200 ${abierto ? 'rotate-180' : ''}`} />
      </div>

      {abierto && (
        <div className="px-5 pb-4 flex gap-2 bg-[#FAFAFA]">
          <button onClick={() => onVerDetalle(p)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111827] hover:bg-[#374151] text-white text-xs font-bold transition-all cursor-pointer">
            <i className="ri-eye-line" /> Ver detalle
          </button>
          <button onClick={() => {}}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#0D9488] hover:text-[#0D9488] text-[#374151] text-xs font-semibold transition-all cursor-pointer">
            <i className="ri-refresh-line" /> Repetir
          </button>
        </div>
      )}
    </div>
  )
}

/* ── Componente principal ── */
function TabPedidos({ pedidos, pagados, pendientes, navigate, perfil, setPedidos }) {
  const [filtro,      setFiltro]      = useState('todos')
  const [expandidoId, setExpandidoId] = useState(null)
  const [detalle,     setDetalle]     = useState(null)

  if (detalle) return (
    <DetallePedido
      pedido={detalle}
      onVolver={() => setDetalle(null)}
      navigate={navigate}
      perfil={perfil}
    />
  )

  const totalGastado = pedidos
    .filter(p => p.estado === 'pagado')
    .reduce((s, p) => s + Number(p.monto_total), 0)

  const efectivos = pedidos.filter(p => p.estado === 'efectivo').length
  const enCurso   = pendientes + efectivos

  const pedidosFiltrados = pedidos.filter(p => {
    if (filtro === 'en_curso')    return p.estado === 'pendiente' || p.estado === 'efectivo'
    if (filtro === 'entregados')  return p.estado === 'pagado'
    return true
  })

  if (pedidos.length === 0) return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center">
      <i className="ri-shopping-bag-line text-5xl text-[#E5E7EB] block mb-3" />
      <h3 className="text-sm font-bold text-[#111827] mb-2">Aún no tienes pedidos</h3>
      <button onClick={() => navigate('/tiendas')}
        className="px-6 py-2.5 rounded-xl bg-[#0D9488] text-white font-semibold text-xs cursor-pointer hover:bg-[#0F766E] transition-all">
        Explorar tiendas
      </button>
    </div>
  )

  return (
    <div className="space-y-4">

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: 'ri-file-list-3-line', iconBg: 'bg-[#111827]', iconColor: 'text-white', valor: pedidos.length, label: 'Total' },
          { icon: 'ri-time-line',        iconBg: 'bg-amber-100',  iconColor: 'text-amber-500', valor: enCurso, label: 'En curso',    dot: enCurso > 0 },
          { icon: 'ri-checkbox-circle-line', iconBg: 'bg-[#F3F4F6]', iconColor: 'text-[#9CA3AF]', valor: pagados, label: 'Entregados' },
          { icon: 'ri-money-dollar-circle-line', iconBg: null, iconColor: 'text-[#9CA3AF]', valor: null, label: 'Total gastado', extra: `S/ ${totalGastado.toFixed(2)}` },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex items-center gap-3">
            {s.iconBg && (
              <div className={`relative w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.iconBg}`}>
                <i className={`${s.icon} text-sm ${s.iconColor}`} />
                {s.dot && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-white" />}
              </div>
            )}
            <div>
              {s.valor !== null
                ? <p className="text-xl font-black text-[#111827] leading-none">{s.valor}</p>
                : <p className="text-base font-black text-[#111827] leading-none">{s.extra}</p>
              }
              <p className="text-[10px] text-[#9CA3AF] mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-2">
        {[
          { key: 'todos',       label: 'Todos',      count: pedidos.length },
          { key: 'en_curso',    label: 'En curso',   count: enCurso },
          { key: 'entregados',  label: 'Entregados', count: pagados },
        ].map(f => (
          <button key={f.key} onClick={() => { setFiltro(f.key); setExpandidoId(null) }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filtro === f.key
                ? 'bg-[#111827] text-white'
                : 'bg-white border border-[#E5E7EB] text-[#374151] hover:border-[#0D9488] hover:text-[#0D9488]'
            }`}>
            {f.key === 'en_curso'   && <i className="ri-time-line text-[10px]" />}
            {f.key === 'entregados' && <i className="ri-checkbox-circle-line text-[10px]" />}
            {f.key === 'todos'      && <i className="ri-equalizer-line text-[10px]" />}
            {f.label} {f.count}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
        {pedidosFiltrados.length === 0 ? (
          <div className="py-10 text-center text-sm text-[#9CA3AF]">No hay pedidos en esta categoría</div>
        ) : (
          pedidosFiltrados.map(p => (
            <FilaPedido
              key={p.pk_id}
              p={p}
              expandidoId={expandidoId}
              setExpandidoId={setExpandidoId}
              onVerDetalle={setDetalle}
            />
          ))
        )}
      </div>

      {/* Footer info */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: 'ri-map-pin-time-line', titulo: 'Seguimiento',     desc: 'Cuando tu pedido esté en camino, vas a recibir un número de tracking para seguirlo paso a paso.' },
          { icon: 'ri-refresh-line',      titulo: 'Repetir compra',  desc: 'Volvé a pedir lo que te gustó con un solo click. Los productos van directo al carrito.' },
          { icon: 'ri-shield-check-line', titulo: 'Compra protegida', desc: 'Todas tus compras en CRECIO están protegidas. Si hay un problema, te ayudamos.' },
        ].map((f, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] p-4">
            <i className={`${f.icon} text-[#0D9488] text-lg mb-2 block`} />
            <p className="text-xs font-bold text-[#111827] mb-1">{f.titulo}</p>
            <p className="text-[10px] text-[#9CA3AF] leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TabPedidos
