import { useState } from 'react'
import { Smartphone, DollarSign, CreditCard, Truck, Store } from 'lucide-react'
import { currency } from '../../utils/formatters'
import { actualizarEstadoPedido } from '../../services/apiAdmin'
import { estadoPedidoInfo, accionesPedido } from '../../utils/orderStatus'
import ModalShell from '../common/ModalShell'

export default function SaleDetailModal({ isOpen, sale, onClose, onUpdated }) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  if (!sale) return null

  const estadoInfo = estadoPedidoInfo(sale)
  const { siguiente, puedeCancelar } = accionesPedido(sale)
  const esDelivery = (sale.tipo_entrega || 'delivery') === 'delivery'

  const cambiarEstado = async (estado) => {
    if (estado === 'cancelado') {
      const aviso = sale.stripe_payment_intent
        ? '¿Cancelar este pedido? Se devolverá el stock y se reembolsará el pago con tarjeta.'
        : '¿Cancelar este pedido? Se devolverá el stock de los productos.'
      if (!window.confirm(aviso)) return
    }
    setSaving(true)
    setError('')
    try {
      const actualizado = await actualizarEstadoPedido(sale.pk_id, estado)
      onUpdated?.({ ...sale, ...actualizado })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

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
    <>
      {puedeCancelar && (
        <button className="btn-ui-outline" style={{ color: '#dc2626' }} onClick={() => cambiarEstado('cancelado')} disabled={saving}>
          Cancelar pedido
        </button>
      )}
      <button className="btn-ui-outline" onClick={onClose}>
        Cerrar
      </button>
      {siguiente && (
        <button className="btn-ui-primary" onClick={() => cambiarEstado(siguiente.estado)} disabled={saving}>
          {saving ? 'Guardando...' : siguiente.texto}
        </button>
      )}
    </>
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

        {/* Estado del pedido y tipo de entrega */}
        <div className="sale-section">
          <span className="sale-section-label">Estado del pedido</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span className={`order-status-tag ${estadoInfo.tone}`} style={{ fontSize: '12px', padding: '4px 10px' }}>
              {estadoInfo.label}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569' }}>
              {esDelivery ? <Truck size={14} /> : <Store size={14} />}
              {esDelivery ? 'Delivery del negocio' : 'Recojo en tienda'}
            </span>
          </div>
          {esDelivery && sale.direccion && (
            <p className="sale-notes-text" style={{ marginTop: '8px' }}>
              {[sale.direccion, sale.ciudad].filter(Boolean).join(', ')}
            </p>
          )}
          {error && <div className="toast-error" style={{ marginTop: '8px' }}>{error}</div>}
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
