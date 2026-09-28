import { Plus, ArrowDown, Wallet, Percent, ShoppingBag } from 'lucide-react'
import { currency } from '../../utils/formatters'

export default function FinanceMetrics({ summary, isMonth }) {
  const income = isMonth ? Number(summary.ingresos_mes ?? 0) : Number(summary.ingresos_hoy ?? 0)
  const expenses = isMonth ? Number(summary.gastos_mes ?? 0) : Number(summary.gastos_hoy ?? 0)
  const netProfit = income - expenses
  const profitMargin = income > 0 ? ((netProfit / income) * 100).toFixed(1) : '0.0'
  const ops = isMonth ? Number(summary.operaciones_mes ?? 0) : Number(summary.operaciones_hoy ?? 0)

  return (
    <div className="finance-metrics-grid">
      {/* Card 1: Ingresos */}
      <div className="fin-metric-card">
        <div className="fin-metric-header">
          <div className="fin-icon-circle green">
            <Plus size={14} />
          </div>
          <span className="fin-metric-title">{isMonth ? 'Ingresos del Mes' : 'Ingresos de Hoy'}</span>
        </div>
        <div className="fin-metric-value">{currency.format(income)}</div>
        <small className="text-xs text-slate-400 font-medium">
          {isMonth ? 'Total de ventas en el mes' : 'Caja cobrada el día de hoy'}
        </small>
      </div>

      {/* Card 2: Gastos */}
      <div className="fin-metric-card">
        <div className="fin-metric-header">
          <div className="fin-icon-circle red">
            <ArrowDown size={14} />
          </div>
          <span className="fin-metric-title">{isMonth ? 'Gastos del Mes' : 'Gastos de Hoy'}</span>
        </div>
        <div className="fin-metric-value">{currency.format(expenses)}</div>
        <small className="text-xs text-slate-400 font-medium">
          {isMonth ? 'Gastos acumulados del mes' : 'Egresos e insumos de hoy'}
        </small>
      </div>

      {/* Card 3: Utilidad Neta */}
      <div className="fin-metric-card">
        <div className="fin-metric-header">
          <div className="fin-icon-circle mint">
            <Wallet size={14} />
          </div>
          <span className="fin-metric-title">{isMonth ? 'Utilidad Neta del Mes' : 'Utilidad Neta de Hoy'}</span>
        </div>
        <div className="fin-metric-value" style={{ color: netProfit < 0 ? '#ef4444' : '#10b981' }}>
          {currency.format(netProfit)}
        </div>
        <small className="text-xs text-slate-400 font-medium">
          {isMonth ? 'Balance total neto mensual' : 'Balance neto de caja hoy'}
        </small>
      </div>

      {/* Card 4: Operaciones / Margen */}
      <div className="fin-metric-card">
        <div className="fin-metric-header">
          <div className="fin-icon-circle yellow">
            {isMonth ? <Percent size={14} /> : <ShoppingBag size={14} />}
          </div>
          <span className="fin-metric-title">{isMonth ? 'Margen de Ganancia' : 'Operaciones de Hoy'}</span>
        </div>
        <div className="fin-metric-value">{isMonth ? `${profitMargin}%` : `${ops} ventas`}</div>
        <small className="text-xs text-slate-400 font-medium">
          {isMonth ? 'Rentabilidad sobre ventas' : 'Transacciones concretadas hoy'}
        </small>
      </div>
    </div>
  )
}
