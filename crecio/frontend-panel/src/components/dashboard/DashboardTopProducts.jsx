import { useNavigate } from 'react-router-dom'
import { currency } from '../../utils/formatters'

export default function DashboardTopProducts({ products }) {
  const navigate = useNavigate()

  const hasProducts = Array.isArray(products) && products.length > 0

  return (
    <div className="dash-card dash-products-card">
      <div className="dash-card-header">
        <h3 className="dash-card-title">Productos Más Vendidos</h3>
        <button className="dash-link-btn" onClick={() => navigate('/inventario')}>
          Ver inventario
        </button>
      </div>

      <div className="top-products-list">
        {hasProducts ? (
          products.map((item, idx) => {
            const val = Number(item.ingresos_totales || item.total || 0)
            const salesVal = item.total_vendido || item.sales || item.ventas || 0
            return (
              <div key={item.pk_id || item.nombre || idx} className="top-prod-row">
                <div className="rank-badge">{idx + 1}</div>

                <div className="top-prod-info">
                  <strong className="top-prod-name">{item.nombre || item.name}</strong>
                  <span className="top-prod-sales">
                    {salesVal} unidades vendidas
                  </span>
                </div>

                <div className="top-prod-total-col">
                  <strong className="top-prod-price">
                    {currency.format(isNaN(val) ? 0 : val)}
                  </strong>
                  <div className="top-prod-bar-track">
                    <div
                      className="top-prod-bar-fill"
                      style={{ width: `${Math.min(100, Math.max(15, (5 - idx) * 20))}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
            Aún no se han registrado ventas de productos para este negocio.
          </div>
        )}
      </div>
    </div>
  )
}
