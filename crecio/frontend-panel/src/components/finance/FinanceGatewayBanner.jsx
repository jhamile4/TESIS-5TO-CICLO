import { CreditCard, Check } from 'lucide-react'

export default function FinanceGatewayBanner() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(220px, 320px) 1fr',
      border: '1px solid #e2e8f0',
      borderRadius: '18px',
      overflow: 'hidden',
      background: '#ffffff',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.02)',
      marginBottom: '24px'
    }}>
      {/* Left Box (Teal Gradient) */}
      <div style={{
        background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
        color: '#ffffff',
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.18)',
          backdropFilter: 'blur(4px)',
          display: 'grid', placeItems: 'center',
          marginBottom: '12px'
        }}>
          <CreditCard size={24} />
        </div>
        <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '900' }}>
          Pasarela Pro
        </h3>
        <p style={{ margin: 0, fontSize: '11px', opacity: 0.9, lineHeight: '1.4' }}>
          Integración directa con Visa, Mastercard y más.
        </p>
      </div>

      {/* Right Box (White Content + Checklist + Button) */}
      <div style={{
        padding: '24px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h3 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
            Activar Cobros con Tarjeta
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px 24px',
            fontSize: '12px',
            color: '#475569',
            fontWeight: '600'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={14} style={{ color: '#0d9488' }} /> Pagos recurrentes automáticos
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={14} style={{ color: '#0d9488' }} /> Seguridad cifrada nivel bancario
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={14} style={{ color: '#0d9488' }} /> Liquidación en 24 horas
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={14} style={{ color: '#0d9488' }} /> Reportes detallados de venta
            </div>
          </div>
        </div>

        <button style={{
          padding: '12px 24px',
          borderRadius: '10px',
          background: '#0d9488',
          color: '#ffffff',
          fontSize: '13px',
          fontWeight: '800',
          border: 'none',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'background 0.2s',
          boxShadow: '0 4px 12px rgba(13, 148, 136, 0.25)'
        }}>
          Activar Ahora
        </button>
      </div>
    </div>
  )
}
