import { ShoppingBag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { currency } from '../../utils/formatters'

export default function DashboardRecentOrders({ orders }) {
  const navigate = useNavigate()

  const displayOrders = Array.isArray(orders) ? orders : []

  const getItemCount = (items) => {
    if (typeof items === 'number') return items
    if (Array.isArray(items)) return items.length
    if (typeof items === 'string') {
      try {
        const parsed = JSON.parse(items)
        if (Array.isArray(parsed)) return parsed.length
      } catch {}
    }
    return 1
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completada':
      case 'pagado':
        return 'status-green'
      case 'pendiente':
        return 'status-orange'
      case 'enviada':
        return 'status-blue'
      case 'cancelada':
        return 'status-red'
      default:
        return 'status-gray'
    }
  }

  const getIconColorClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completada': return 'icon-green'
      case 'pendiente': return 'icon-orange'
      case 'enviada': return 'icon-blue'
      case 'cancelada': return 'icon-red'
      default: return 'icon-green'
    }
  }

  return (
    <div className="dash-card dash-orders-card">
      <div className="dash-card-header">
        <h3 className="dash-card-title">Órdenes Recientes</h3>
        <button className="dash-link-btn" onClick={() => navigate('/ventas')}>
          Ver todas
        </button>
      </div>

      <div className="orders-list">
        {displayOrders.length > 0 ? (
          displayOrders.map((ord, idx) => (
            <div key={ord.pk_id || ord.id || idx} className="order-row-item">
              <div className={`order-icon-circle ${getIconColorClass(ord.estado || ord.status)}`}>
                {ShoppingBag ? <ShoppingBag size={16} /> : <span>🛍️</span>}
              </div>

              <div className="order-info-col">
                <strong className="order-code-text">
                  {ord.numero_pedido || ord.id || `ORD-${ord.pk_id}`}
                </strong>
                <span className="order-subtext">
                  {ord.cliente_nombre || ord.client || 'Cliente invitado'} · {getItemCount(ord.items)} items
                </span>
              </div>

              <div className="order-total-col">
                <strong className="order-amount">
                  {currency.format(ord.monto_total || ord.total || 0)}
                </strong>
                <span className={`order-status-tag ${getStatusColor(ord.estado || ord.status)}`}>
                  {ord.estado || ord.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
            No hay órdenes recientes registradas.
          </div>
        )}
      </div>
    </div>
  )
}
