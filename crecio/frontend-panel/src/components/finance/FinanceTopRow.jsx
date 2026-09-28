import { Sparkles, Plus, ArrowDown, Wallet } from 'lucide-react'
import { currency } from '../../utils/formatters'

export default function FinanceTopRow({ summary, isMonth }) {
  const income = isMonth ? Number(summary.ingresos_mes || 0) : Number(summary.ingresos_hoy || 0)
  const expenses = isMonth ? Number(summary.gastos_mes || 0) : Number(summary.gastos_hoy || 0)
  const netProfit = income - expenses

  return (
    <div className="fin-top-4grid" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      {/* Card 1: Ingresos Totales */}
      <div className="fin-card-item" style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', width: '100%', marginBottom: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: '#ecfdf5', color: '#10b981',
            display: 'grid', placeItems: 'center', border: '1px solid #a7f3d0'
          }}>
            <Plus size={18} />
          </div>
          <span style={{
            marginLeft: 'auto', background: '#d1fae5', color: '#047857',
            fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '12px'
          }}>
            +12.4%
          </span>
        </div>
        <div>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
            {isMonth ? 'Ingresos Totales (Mes)' : 'Ingresos Totales (Hoy)'}
          </span>
          <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#0f172a', margin: '4px 0 8px' }}>
            {currency.format(income)}
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: '800', background: '#f1f5f9', color: '#334155', padding: '2px 6px', borderRadius: '4px' }}>S/</span>
          <span style={{ fontSize: '10px', fontWeight: '800', background: '#f1f5f9', color: '#334155', padding: '2px 6px', borderRadius: '4px' }}>Tarjeta</span>
          <span style={{ fontSize: '10px', fontWeight: '800', background: '#f1f5f9', color: '#334155', padding: '2px 6px', borderRadius: '4px' }}>Yape</span>
        </div>
      </div>

      {/* Card 2: Gastos Totales */}
      <div className="fin-card-item" style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', width: '100%', marginBottom: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: '#ffe4e6', color: '#f43f5e',
            display: 'grid', placeItems: 'center', border: '1px solid #fecdd3'
          }}>
            <ArrowDown size={18} />
          </div>
          <span style={{
            marginLeft: 'auto', background: '#ffe4e6', color: '#e11d48',
            fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '12px'
          }}>
            -3.2%
          </span>
        </div>
        <div>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
            {isMonth ? 'Gastos Totales (Mes)' : 'Gastos Totales (Hoy)'}
          </span>
          <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#0f172a', margin: '4px 0 8px' }}>
            {currency.format(expenses)}
          </h2>
        </div>
        <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>
          {isMonth ? 'Próximo pago: En 3 días' : 'Gastos registrados hoy'}
        </span>
      </div>

      {/* Card 3: Utilidad Neta */}
      <div className="fin-card-item" style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: '#ccfbf1', color: '#0d9488',
            display: 'grid', placeItems: 'center', border: '1px solid #99f6e4'
          }}>
            <Wallet size={18} />
          </div>
        </div>
        <div>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Utilidad Neta</span>
          <h2 style={{
            fontSize: '26px', fontWeight: '900',
            color: netProfit < 0 ? '#ef4444' : '#10b981',
            margin: '4px 0 8px'
          }}>
            {currency.format(netProfit)}
          </h2>
        </div>
        <div style={{ width: '100%', height: '4px', background: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{
            width: netProfit >= 0 ? '70%' : '30%',
            height: '100%',
            background: netProfit >= 0 ? '#10b981' : '#ef4444'
          }}></div>
        </div>
      </div>

      {/* Card 4: Consejos Financieros de IA (Dark Navy) */}
      <div className="fin-card-item dark-ai-card" style={{
        background: '#0f172a',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.25)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#38bdf8' }}>
            <Sparkles size={16} />
            <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: '#ffffff' }}>
              Consejos Financieros de IA
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>
            <p style={{ margin: 0 }}>
              • <strong style={{ color: '#ffffff' }}>Gasto Crítico:</strong> Reduce los costos en <span style={{ color: '#38bdf8', textDecoration: 'underline' }}>Suministros</span>. Excediste el presupuesto un 15% este mes.
            </p>
            <p style={{ margin: 0 }}>
              • <strong style={{ color: '#ffffff' }}>Proyección:</strong> Se estima un crecimiento del <strong style={{ color: '#34d399' }}>8.4%</strong> para el próximo mes.
            </p>
          </div>
        </div>

        <button style={{
          marginTop: '14px',
          width: '100%',
          padding: '8px 12px',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          color: '#ffffff',
          fontSize: '11px',
          fontWeight: '700',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}>
          Ver Análisis Completo
        </button>
      </div>
    </div>
  )
}
