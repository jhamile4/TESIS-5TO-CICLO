import { currency } from '../../utils/formatters'

export default function FinanceBreakdownRow({ summary, isMonth }) {
  const totalInc = isMonth ? Number(summary?.ingresos_mes || 0) : Number(summary?.ingresos_hoy || 0)
  const tarjetaInc = isMonth ? Number(summary?.ingresos_tarjeta || 0) : Number(summary?.ingresos_tarjeta_hoy || 0)
  const efectivoInc = isMonth ? Number(summary?.ingresos_efectivo || 0) : Number(summary?.ingresos_efectivo_hoy || 0)

  const pctTarjeta = totalInc > 0 ? ((tarjetaInc / totalInc) * 100).toFixed(1) : '0'
  const pctEfectivo = totalInc > 0 ? ((efectivoInc / totalInc) * 100).toFixed(1) : '0'

  const totalGastos = isMonth ? Number(summary?.gastos_mes || 0) : Number(summary?.gastos_hoy || 0)

  const expensesList = [
    { 
      label: isMonth ? 'Gastos Operativos del Mes' : 'Gastos e Insumos de Hoy', 
      amount: totalGastos, 
      pct: totalGastos > 0 ? 100 : 0 
    }
  ]

  const incomeList = [
    { label: 'Ventas por Tarjeta (Stripe)', amount: tarjetaInc, pct: pctTarjeta },
    { label: 'Ventas Efectivo / Yape / Plin', amount: efectivoInc, pct: pctEfectivo }
  ]

  return (
    <div className="fin-breakdown-grid">
      {/* Card 1: Desglose de Gastos */}
      <div className="fin-card fin-breakdown-card">
        <h3 className="fin-card-title">
          {isMonth ? 'Desglose de Gastos del Mes' : 'Desglose de Gastos de Hoy'}
        </h3>

        <div className="breakdown-list">
          {expensesList.map((item) => (
            <div key={item.label} className="breakdown-item">
              <div className="breakdown-label-row">
                <span className="bk-name">{item.label}</span>
                <span className="bk-values">
                  <strong>{currency.format(item.amount)}</strong>
                  <span className="bk-pct">({item.pct}%)</span>
                </span>
              </div>
              <div className="fin-progress-bar-track small">
                <div
                  className="fin-progress-bar-fill orange"
                  style={{ width: `${item.pct}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card 2: Fuentes de Ingreso */}
      <div className="fin-card fin-breakdown-card">
        <h3 className="fin-card-title">
          {isMonth ? 'Fuentes de Ingreso del Mes' : 'Fuentes de Ingreso de Hoy'}
        </h3>

        <div className="breakdown-list">
          {incomeList.map((item) => (
            <div key={item.label} className="breakdown-item">
              <div className="breakdown-label-row">
                <span className="bk-name">{item.label}</span>
                <span className="bk-values">
                  <strong>{currency.format(item.amount)}</strong>
                  <span className="bk-pct">({item.pct}%)</span>
                </span>
              </div>
              <div className="fin-progress-bar-track small">
                <div
                  className="fin-progress-bar-fill teal"
                  style={{ width: `${item.pct}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
