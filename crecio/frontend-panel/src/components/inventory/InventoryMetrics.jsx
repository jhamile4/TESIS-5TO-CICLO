import { Package, AlertCircle, ShoppingCart, FileText } from 'lucide-react'
import { currency } from '../../utils/formatters'

export default function InventoryMetrics({ metrics }) {
  const total = metrics?.totalProductos ?? 0
  const alertas = metrics?.alertasStockBajo ?? 0
  const unidadesStock = metrics?.unidadesStock ?? 0
  const valor = metrics?.valorInventario ?? 0

  return (
    <div className="inventory-metrics-grid">
      <div className="inv-metric-card">
        <div>
          <span className="metric-label">Total productos</span>
          <div className="metric-num">{total}</div>
          <small className="metric-sub">productos registrados</small>
        </div>
        <div className="metric-icon-box mint-box">
          <Package size={20} />
        </div>
      </div>

      <div className="inv-metric-card">
        <div>
          <span className="metric-label">Alertas de stock bajo</span>
          <div className="metric-num text-red">{alertas}</div>
          <small className="metric-sub text-red">items restantes</small>
        </div>
        <div className="metric-icon-box pink-box">
          <AlertCircle size={20} className="text-red" />
        </div>
      </div>

      <div className="inv-metric-card">
        <div>
          <span className="metric-label">Unidades en stock</span>
          <div className="metric-num">{unidadesStock}</div>
          <small className="metric-sub">sumando todos los productos</small>
        </div>
        <div className="metric-icon-box mint-box">
          <ShoppingCart size={20} />
        </div>
      </div>

      <div className="inv-metric-card">
        <div>
          <span className="metric-label">Valor est. del inventario</span>
          <div className="metric-num">{currency.format(valor)}</div>
          <small className="metric-sub">valor neto</small>
        </div>
        <div className="metric-icon-box mint-box">
          <FileText size={20} />
        </div>
      </div>
    </div>
  )
}
