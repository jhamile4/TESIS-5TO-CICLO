import { Plus, ArrowDown, Wallet, Percent } from 'lucide-react'
import { currency } from '../../utils/formatters'

export default function FinanceMetricsMonthly({ summary }) {
  const income = Number(summary?.ingresos_mes ?? 0)
  const expenses = Number(summary?.gastos_mes ?? 0)
  const netProfit = income - expenses
  const profitMargin = income > 0 ? ((netProfit / income) * 100).toFixed(1) : '0.0'

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      {/* Card 1: Ingresos del Mes */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: '#ecfdf5', color: '#10b981', display: 'grid', placeItems: 'center', border: '1px solid #a7f3d0'
          }}>
            <Plus size={14} />
          </div>
          <span style={{ fontWeight: '600', color: '#64748b' }}>Ingresos del Mes</span>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', margin: 0 }}>
          {currency.format(income)}
        </h2>
      </div>

      {/* Card 2: Gastos del Mes */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: '#ffe4e6', color: '#f43f5e', display: 'grid', placeItems: 'center', border: '1px solid #fecdd3'
          }}>
            <ArrowDown size={14} />
          </div>
          <span style={{ fontWeight: '600', color: '#64748b' }}>Gastos del Mes</span>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', margin: 0 }}>
          {currency.format(expenses)}
        </h2>
      </div>

      {/* Card 3: Ganancia Neta */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: '#ccfbf1', color: '#0d9488', display: 'grid', placeItems: 'center', border: '1px solid #99f6e4'
          }}>
            <Wallet size={14} />
          </div>
          <span style={{ fontWeight: '600', color: '#64748b' }}>Ganancia Neta</span>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '900', color: netProfit < 0 ? '#ef4444' : '#0f172a', margin: 0 }}>
          {currency.format(netProfit)}
        </h2>
      </div>

      {/* Card 4: Margen de Ganancia */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: '#fef3c7', color: '#d97706', display: 'grid', placeItems: 'center', border: '1px solid #fde68a'
          }}>
            <Percent size={14} />
          </div>
          <span style={{ fontWeight: '600', color: '#64748b' }}>Margen de Ganancia</span>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', margin: 0 }}>
          {profitMargin}%
        </h2>
      </div>
    </div>
  )
}
