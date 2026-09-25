import { currency } from '../../utils/formatters'

export default function FinanceBreakdownRow({ summary }) {
  const totalInc = Number(summary?.ingresos_mes || 0)
  const tarjetaInc = Number(summary?.ingresos_tarjeta || 0)
  const efectivoInc = Number(summary?.ingresos_efectivo || 0)

  const pctTarjeta = totalInc > 0 ? ((tarjetaInc / totalInc) * 100).toFixed(1) : '0'
  const pctEfectivo = totalInc > 0 ? ((efectivoInc / totalInc) * 100).toFixed(1) : '0'

  const totalGastos = Number(summary?.gastos_mes || 0)

  const expensesList = [
    { label: 'Gastos Operativos Registrados', amount: totalGastos, pct: totalGastos > 0 ? 100 : 0 }
  ]

  const incomeList = [
    { label: 'Ventas por Tarjeta (Stripe)', amount: tarjetaInc, pct: pctTarjeta },
    { label: 'Ventas Efectivo / Directo', amount: efectivoInc, pct: pctEfectivo }
  ]

  return (
    <div className="fin-breakdown-grid">
      {/* Card 1: Desglose de Gastos */}
      <div className="fin-card fin-breakdown-card">
        <h3 className="fin-card-title">Desglose de Gastos</h3>

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
        <h3 className="fin-card-title">Fuentes de Ingreso</h3>

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
