import { DollarSign, ShoppingBag, Users, Package, TrendingUp } from 'lucide-react'
import { currency } from '../../utils/formatters'

export default function DashboardMetricsRow({ metrics }) {
  const ventas = metrics?.ventasTotales ? currency.format(metrics.ventasTotales) : 'S/ 24.580'
  const ordenes = metrics?.ordenes || 156
  const clientes = metrics?.clientes || 89
  const productos = metrics?.productos || 45

  return (
    <div className="dash-metrics-grid">
      {/* Ventas Totales */}
      <div className="dash-metric-card">
        <div className="dash-metric-left">
          <span className="dash-metric-label">Ventas Totales</span>
          <strong className="dash-metric-val">{ventas}</strong>
          <div className="dash-metric-trend green">
            <TrendingUp size={13} />
            <span>12.5% vs mes pasado</span>
          </div>
        </div>
        <div className="dash-icon-box green">
          <DollarSign size={20} />
        </div>
      </div>

      {/* Órdenes */}
      <div className="dash-metric-card">
        <div className="dash-metric-left">
          <span className="dash-metric-label">Órdenes</span>
          <strong className="dash-metric-val">{ordenes}</strong>
          <div className="dash-metric-trend green">
            <TrendingUp size={13} />
            <span>8.3% vs mes pasado</span>
          </div>
        </div>
        <div className="dash-icon-box green">
          <ShoppingBag size={20} />
        </div>
      </div>

      {/* Clientes */}
      <div className="dash-metric-card">
        <div className="dash-metric-left">
          <span className="dash-metric-label">Clientes</span>
          <strong className="dash-metric-val">{clientes}</strong>
          <div className="dash-metric-trend green">
            <TrendingUp size={13} />
            <span>15.2% vs mes pasado</span>
          </div>
        </div>
        <div className="dash-icon-box green">
          <Users size={20} />
        </div>
      </div>

      {/* Productos */}
      <div className="dash-metric-card">
        <div className="dash-metric-left">
          <span className="dash-metric-label">Productos</span>
          <strong className="dash-metric-val">{productos}</strong>
          <div className="dash-metric-trend green">
            <TrendingUp size={13} />
            <span>5.1% vs mes pasado</span>
          </div>
        </div>
        <div className="dash-icon-box green">
          <Package size={20} />
        </div>
      </div>
    </div>
  )
}
