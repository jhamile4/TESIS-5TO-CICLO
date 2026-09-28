import { currency } from '../../utils/formatters'

export default function FinanceBreakdownRowMonthly({ summary }) {
  const totalInc = Number(summary?.ingresos_mes ?? 0)
  const totalGastos = Number(summary?.gastos_mes ?? 0)
  const tarjetaInc = Number(summary?.ingresos_tarjeta ?? 0)
  const efectivoInc = Number(summary?.ingresos_efectivo ?? 0)

  const pctTarjeta = totalInc > 0 ? ((tarjetaInc / totalInc) * 100).toFixed(1) : '0'
  const pctEfectivo = totalInc > 0 ? ((efectivoInc / totalInc) * 100).toFixed(1) : '0'

  const expensesList = [
    { label: 'Gastos Operativos Registrados', amount: totalGastos, pct: totalGastos > 0 ? 100 : 0 }
  ]

  const incomeList = [
    { label: 'Ventas por Tarjeta (Stripe)', amount: tarjetaInc, pct: pctTarjeta },
    { label: 'Ventas Efectivo / Directo', amount: efectivoInc, pct: pctEfectivo }
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      marginBottom: '24px'
    }}>
      {/* Card 1: Desglose de Gastos */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '20px'
      }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
          Desglose de Gastos del Mes
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {expensesList.map((item) => (
            <div key={item.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ fontWeight: '600', color: '#334155' }}>{item.label}</span>
                <span style={{ color: '#64748b' }}>
                  <strong style={{ color: '#0f172a' }}>{currency.format(item.amount)}</strong> ({item.pct}%)
                </span>
              </div>
              <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${item.pct}%`, height: '100%', background: '#f59e0b' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card 2: Fuentes de Ingreso */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '20px'
      }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
          Fuentes de Ingreso del Mes
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {incomeList.map((item) => (
            <div key={item.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ fontWeight: '600', color: '#334155' }}>{item.label}</span>
                <span style={{ color: '#64748b' }}>
                  <strong style={{ color: '#0f172a' }}>{currency.format(item.amount)}</strong> ({item.pct}%)
                </span>
              </div>
              <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${item.pct}%`, height: '100%', background: '#0d9488' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
