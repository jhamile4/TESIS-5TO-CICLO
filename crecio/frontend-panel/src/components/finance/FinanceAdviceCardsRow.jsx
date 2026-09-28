import { BarChart3, ShieldCheck, Sprout, Truck } from 'lucide-react'
import { currency } from '../../utils/formatters'

export default function FinanceAdviceCardsRow({ summary }) {
  const totalGlobal = Number(summary?.ingresos_mes || 0)

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      {/* Card 1: Resumen Global (Dark Navy) */}
      <div style={{
        background: '#0f172a',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.2)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#38bdf8' }}>
            <BarChart3 size={15} />
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Resumen Global
            </span>
          </div>

          <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#ffffff', margin: '4px 0 6px' }}>
            {currency.format(totalGlobal)}
          </h2>
          <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', lineHeight: '1.4' }}>
            Ventas totales registradas en la plataforma
          </p>
        </div>

        <div style={{
          marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '11px', fontWeight: '700', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px'
        }}>
          ↑ Datos en tiempo real de tu tienda
        </div>
      </div>

      {/* Card 2: Fondo de emergencia */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', marginBottom: '10px' }}>
          <ShieldCheck size={18} />
          <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: '#0d9488' }}>
            Fondo de emergencia
          </h4>
        </div>
        <p style={{ margin: 0, fontSize: '11px', color: '#64748b', lineHeight: '1.5' }}>
          Guarda el 10% de tus ganancias diarias para contar con un respaldo financiero ante cualquier imprevisto.
        </p>
      </div>

      {/* Card 3: Reinversión inteligente */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0d9488', marginBottom: '10px' }}>
          <Sprout size={18} />
          <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: '#0d9488' }}>
            Reinversión inteligente
          </h4>
        </div>
        <p style={{ margin: 0, fontSize: '11px', color: '#64748b', lineHeight: '1.5' }}>
          Reinvierte un porcentaje de tus utilidades mensuales en los productos de mayor rotación de tu catálogo.
        </p>
      </div>

      {/* Card 4: Reduce gastos en envíos */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0d9488', marginBottom: '10px' }}>
          <Truck size={18} />
          <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: '#0d9488' }}>
            Reduce gastos en envíos
          </h4>
        </div>
        <p style={{ margin: 0, fontSize: '11px', color: '#64748b', lineHeight: '1.5' }}>
          Monitorea tus costos de courier para acordar tarifas preferenciales con tus aliados de transporte.
        </p>
      </div>
    </div>
  )
}
