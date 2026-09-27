import { X, Smartphone, DollarSign, CreditCard } from 'lucide-react'
import { currency } from '../../utils/formatters'

export default function SaleDetailModal({ isOpen, sale, onClose }) {
  if (!isOpen || !sale) return null

  const payMethod = sale.metodo_pago || (sale.stripe_payment_intent ? 'Tarjeta' : 'Efectivo')
  const dateObj = new Date(sale.created_at)

  const parseItems = (rawItems) => {
    if (Array.isArray(rawItems)) return rawItems
    if (typeof rawItems === 'string') {
      try {
        const parsed = JSON.parse(rawItems)
        if (Array.isArray(parsed)) return parsed
      } catch {}
    }
    return []
  }

  const items = parseItems(sale.items)

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="sale-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="sale-modal-header">
          <h3>Detalles de Venta {sale.numero_pedido || `VTA-${sale.pk_id}`}</h3>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px', background: '#f8fafc', padding: '14px', borderRadius: '12px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Cliente</span>
            <strong style={{ display: 'block', color: '#0f172a', fontSize: '14px', marginTop: '2px' }}>
              {sale.cliente_nombre || 'Cliente Directo'}
            </strong>
            <small style={{ color: '#64748b', fontSize: '12px' }}>
              {sale.telefono_cliente || sale.cliente_email || 'Presencial / Tienda'}
            </small>
          </div>

          <div>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Fecha y Hora</span>
            <strong style={{ display: 'block', color: '#0f172a', fontSize: '14px', marginTop: '2px' }}>
              {dateObj.toLocaleDateString('es-PE')}
            </strong>
            <small style={{ color: '#64748b', fontSize: '12px' }}>
              {dateObj.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
            </small>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '8px' }}>
            Método de Pago
          </span>
          <div className={`payment-badge ${payMethod.toLowerCase()}`} style={{ fontSize: '13px', padding: '6px 14px' }}>
            {payMethod === 'Yape' && <Smartphone size={14} />}
            {payMethod === 'Efectivo' && <DollarSign size={14} />}
            {payMethod === 'Tarjeta' && <CreditCard size={14} />}
            {payMethod}
          </div>
        </div>

        {items.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '8px' }}>
              Productos Vendidos
            </span>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
              {items.map((it, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: idx < items.length - 1 ? '1px solid #f1f5f9' : 'none', fontSize: '13px' }}>
                  <span>{it.nombre} x {it.cantidad || 1}</span>
                  <strong style={{ color: '#0f172a' }}>{currency.format((Number(it.precio) || 0) * (Number(it.cantidad) || 1))}</strong>
                </div>
              ))}
            </div>
          </div>
        )}

        {sale.notas && (
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>
              Nota
            </span>
            <p style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', fontSize: '12px', color: '#334155', margin: 0 }}>
              {sale.notas}
            </p>
          </div>
        )}

        <div className="total-banner-box">
          <label>Monto Total</label>
          <h4>{currency.format(Number(sale.monto_total || 0))}</h4>
        </div>

        <div className="modal-actions-row">
          <button className="btn-modal-cancel" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
