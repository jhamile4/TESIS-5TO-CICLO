import { useNavigate } from 'react-router-dom'
import { currency } from '../../utils/formatters'

export default function DashboardTopProducts({ products }) {
  const navigate = useNavigate()

  const topList = products?.length
    ? products
    : [
        { rank: 1, name: 'Camiseta Premium', sales: 45, total: 11250, pct: 90 },
        { rank: 2, name: 'Gorra Deportiva', sales: 38, total: 7600, pct: 75 },
        { rank: 3, name: 'Mochila Urbana', sales: 32, total: 12800, pct: 65 },
        { rank: 4, name: 'Botella Térmica', sales: 28, total: 5600, pct: 55 },
        { rank: 5, name: 'Audífonos Pro', sales: 24, total: 14400, pct: 45 },
      ]

  return (
    <div className="dash-card dash-products-card">
      <div className="dash-card-header">
        <h3 className="dash-card-title">Productos Más Vendidos</h3>
        <button className="dash-link-btn" onClick={() => navigate('/inventario')}>
          Ver inventario
        </button>
      </div>

      <div className="top-products-list">
        {topList.map((item, idx) => {
          const val = Number(item.ingresos_totales || item.total || 0)
          const salesVal = item.total_vendido || item.sales || 0
          return (
            <div key={item.pk_id || item.name || idx} className="top-prod-row">
              <div className="rank-badge">{item.rank || idx + 1}</div>

              <div className="top-prod-info">
                <strong className="top-prod-name">{item.nombre || item.name}</strong>
                <span className="top-prod-sales">
                  {salesVal} ventas
                </span>
              </div>

              <div className="top-prod-total-col">
                <strong className="top-prod-price">
                  {currency.format(isNaN(val) ? 0 : val)}
                </strong>
                <div className="top-prod-bar-track">
                  <div
                    className="top-prod-bar-fill"
                    style={{ width: `${item.pct || Math.min(100, (idx + 1) * 18)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
