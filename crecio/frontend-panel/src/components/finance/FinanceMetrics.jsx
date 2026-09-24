import { Plus, ArrowDown, Wallet, Percent } from 'lucide-react'
import { currency } from '../../utils/formatters'

export default function FinanceMetrics({ summary, isMonth }) {
  const income = isMonth ? (summary.ingresos_mes || 67800) : (summary.ingresos_hoy || 1500)
  const expenses = isMonth ? (summary.gastos_mes || 23400) : (summary.gastos_hoy || 450)
  const netProfit = Number(income) - Number(expenses)
  const profitMargin = income > 0 ? ((netProfit / income) * 100).toFixed(1) : '65.5'

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
      </div>

      {/* Card 3: Ganancia Neta */}
      <div className="fin-metric-card">
        <div className="fin-metric-header">
          <div className="fin-icon-circle mint">
            <Wallet size={14} />
          </div>
          <span className="fin-metric-title">Ganancia Neta</span>
        </div>
        <div className="fin-metric-value">{currency.format(netProfit)}</div>
      </div>

      {/* Card 4: Margen de Ganancia */}
      <div className="fin-metric-card">
        <div className="fin-metric-header">
          <div className="fin-icon-circle yellow">
            <Percent size={14} />
          </div>
          <span className="fin-metric-title">Margen de Ganancia</span>
        </div>
        <div className="fin-metric-value">{profitMargin}%</div>
      </div>
    </div>
  )
}
