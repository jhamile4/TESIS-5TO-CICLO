import { Smartphone, DollarSign, CreditCard } from 'lucide-react'
import { currency } from '../../utils/formatters'
import ModalShell from '../common/ModalShell'

export default function SaleDetailModal({ isOpen, sale, onClose }) {
  if (!sale) return null

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

  const footerAction = (
    <button className="btn-ui-outline" onClick={onClose}>
      Cerrar
    </button>
  )

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={`Detalles de Venta ${sale.numero_pedido || `VTA-${sale.pk_id}`}`}
      maxWidth="500px"
      footer={footerAction}
    >
      <div className="sale-details-container">
        {/* Info Grid */}
        <div className="sale-info-grid">
          <div className="sale-info-card">
            <span className="sale-info-label">Cliente</span>
            <strong className="sale-info-val">
              {sale.cliente_nombre || 'Cliente Directo'}
            </strong>
            <small className="sale-info-sub">
              {sale.telefono_cliente || sale.cliente_email || 'Presencial / Tienda'}
            </small>
          </div>

          <div className="sale-info-card">
            <span className="sale-info-label">Fecha y Hora</span>
            <strong className="sale-info-val">
              {dateObj.toLocaleDateString('es-PE')}
            </strong>
            <small className="sale-info-sub">
              {dateObj.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
            </small>
          </div>
        </div>

        {/* Payment Method */}
        <div className="sale-section">
          <span className="sale-section-label">Método de Pago</span>
          <div className={`payment-badge ${payMethod.toLowerCase()}`}>
            {payMethod === 'Yape' && <Smartphone size={14} />}
            {payMethod === 'Efectivo' && <DollarSign size={14} />}
            {payMethod === 'Tarjeta' && <CreditCard size={14} />}
            <span>{payMethod}</span>
          </div>
        </div>

        {/* Items List */}
        {items.length > 0 && (
          <div className="sale-section">
            <span className="sale-section-label">Productos Vendidos</span>
            <div className="sale-items-table">
              {items.map((it, idx) => (
                <div key={idx} className="sale-item-row">
                  <span>{it.nombre} x {it.cantidad || 1}</span>
                  <strong>{currency.format((Number(it.precio) || 0) * (Number(it.cantidad) || 1))}</strong>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {sale.notas && (
          <div className="sale-section">
            <span className="sale-section-label">Nota</span>
            <p className="sale-notes-text">{sale.notas}</p>
          </div>
        )}

        {/* Total Banner */}
        <div className="total-banner-box">
          <label>Monto Total</label>
          <h4>{currency.format(Number(sale.monto_total || 0))}</h4>
        </div>
      </div>
    </ModalShell>
  )
}
