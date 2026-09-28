import { useState } from 'react'
import { currency } from '../../utils/formatters'
import { MoreHorizontal, CreditCard, DollarSign } from 'lucide-react'

export default function FinanceMiddleRow({ transacciones, summary, isMonth }) {
  const [filter, setFilter] = useState('todos')

  const totalInc = isMonth ? Number(summary?.ingresos_mes ?? 0) : Number(summary?.ingresos_hoy ?? 0)
  const tarjetaInc = isMonth ? Number(summary?.ingresos_tarjeta ?? 0) : Number(summary?.ingresos_tarjeta_hoy ?? 0)
  const efectivoInc = isMonth ? Number(summary?.ingresos_efectivo ?? 0) : Number(summary?.ingresos_efectivo_hoy ?? 0)

  const pctOnline = totalInc > 0 ? ((tarjetaInc / totalInc) * 100).toFixed(1) : '0'
  const pctPresencial = totalInc > 0 ? ((efectivoInc / totalInc) * 100).toFixed(1) : '0'

  const allTx = Array.isArray(transacciones) ? transacciones : []

  const filteredTx = allTx.filter((t) => {
    if (filter === 'ingresos') return (t.monto || t.monto_total || 0) > 0
    if (filter === 'egresos') return (t.monto || t.monto_total || 0) < 0
    return true
  })

  return (
    <div className="fin-middle-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(260px, 1fr) minmax(400px, 2fr)',
      gap: '20px',
      marginBottom: '24px'
    }}>
      {/* Left Box: Fuentes de Ingreso (30%) */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
            Fuentes de Ingreso
          </h3>
          <button style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}>
            <MoreHorizontal size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Ventas Online / Tarjeta */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>💳 Tarjeta (Stripe)</span>
              <strong style={{ marginLeft: 'auto' }}>{pctOnline}%</strong>
            </div>
            <div style={{ width: '100%', height: '7px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, pctOnline)}%`, height: '100%', background: '#0d9488' }}></div>
            </div>
          </div>

          {/* Ventas Efectivo / Directo */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>💵 Efectivo / Directo</span>
              <strong style={{ marginLeft: 'auto' }}>{pctPresencial}%</strong>
            </div>
            <div style={{ width: '100%', height: '7px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, pctPresencial)}%`, height: '100%', background: '#10b981' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Box: Transacciones Recientes (70%) */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
            Transacciones Recientes
          </h3>

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button
              onClick={() => setFilter('todos')}
              style={{
                padding: '5px 12px', border: 'none', borderRadius: '20px',
                fontSize: '11px', fontWeight: '700', cursor: 'pointer',
                background: filter === 'todos' ? '#f1f5f9' : 'transparent',
                color: filter === 'todos' ? '#0f172a' : '#64748b'
              }}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('ingresos')}
              style={{
                padding: '5px 12px', border: 'none', borderRadius: '20px',
                fontSize: '11px', fontWeight: '700', cursor: 'pointer',
                background: filter === 'ingresos' ? '#f1f5f9' : 'transparent',
                color: filter === 'ingresos' ? '#0f172a' : '#64748b'
              }}
            >
              Ingresos
            </button>
            <button
              onClick={() => setFilter('egresos')}
              style={{
                padding: '5px 12px', border: 'none', borderRadius: '20px',
                fontSize: '11px', fontWeight: '700', cursor: 'pointer',
                background: filter === 'egresos' ? '#f1f5f9' : 'transparent',
                color: filter === 'egresos' ? '#0f172a' : '#64748b'
              }}
            >
              Egresos
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        {filteredTx.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9', color: '#94a3b8', textAlign: 'left' }}>
                  <th style={{ padding: '8px 12px', fontWeight: '700' }}>Descripción / Cliente</th>
                  <th style={{ padding: '8px 12px', fontWeight: '700' }}>Fecha</th>
                  <th style={{ padding: '8px 12px', fontWeight: '700', textAlign: 'right' }}>Monto</th>
                  <th style={{ padding: '8px 12px', fontWeight: '700', textAlign: 'center' }}>Estado</th>
                  <th style={{ padding: '8px 12px', fontWeight: '700', textAlign: 'center' }}>Método</th>
                </tr>
              </thead>
              <tbody>
                {filteredTx.map((t, idx) => {
                  const isPositive = (t.monto || t.monto_total || 0) >= 0
                  const amount = Math.abs(t.monto || t.monto_total || 0)
                  const desc = t.numero_pedido || t.desc || `Pedido #${t.pk_id}`
                  const cat = t.cliente_nombre ? `Cliente: ${t.cliente_nombre}` : (t.cat || 'Venta Directa')
                  const tag = isPositive ? 'VT' : 'GA'
                  const fechaText = t.created_at ? new Date(t.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }) : (t.fecha || 'Hoy')
                  const horaText = t.created_at ? new Date(t.created_at).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) : (t.hora || '')

                  return (
                    <tr key={t.pk_id || t.id || idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: isPositive ? '#f0fdf4' : '#ffe4e6',
                            color: isPositive ? '#16a34a' : '#f43f5e',
                            fontWeight: '800', fontSize: '11px',
                            display: 'grid', placeItems: 'center', shrink: 0
                          }}>
                            {tag}
                          </div>
                          <div>
                            <strong style={{ display: 'block', color: '#0f172a', fontSize: '12px' }}>{desc}</strong>
                            <small style={{ color: '#94a3b8', fontSize: '10px' }}>{cat}</small>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '10px 12px', color: '#64748b', whiteSpace: 'nowrap' }}>
                        <div>{fechaText}</div>
                        <small style={{ color: '#94a3b8', fontSize: '10px' }}>{horaText}</small>
                      </td>
                      <td style={{
                        padding: '10px 12px', textAlign: 'right', fontWeight: '800',
                        color: isPositive ? '#10b981' : '#f43f5e', whiteSpace: 'nowrap'
                      }}>
                        {isPositive ? `+${currency.format(amount)}` : `-${currency.format(amount)}`}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <span style={{
                          fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '12px',
                          background: t.estado === 'pagado' || t.estado === 'Registrado' ? '#d1fae5' : '#fef3c7',
                          color: t.estado === 'pagado' || t.estado === 'Registrado' ? '#047857' : '#d97706'
                        }}>
                          {t.estado || 'pagado'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', color: '#64748b' }}>
                        {t.stripe_payment_intent || t.metodo === 'Tarjeta' ? <CreditCard size={14} /> : <DollarSign size={14} />}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
            No hay transacciones registradas para este periodo.
          </div>
        )}
      </div>
    </div>
  )
}
