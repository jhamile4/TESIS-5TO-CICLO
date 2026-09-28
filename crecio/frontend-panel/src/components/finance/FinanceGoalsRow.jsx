import { Calendar, ShieldCheck, Package, DollarSign } from 'lucide-react'
import { currency } from '../../utils/formatters'

export default function FinanceGoalsRow({ summary, isMonth }) {
  if (!isMonth) {
    // Vista Caja del Día
    const ingresosHoy = Number(summary?.ingresos_hoy || 0)
    const gastosHoy = Number(summary?.gastos_hoy || 0)
    const saldoCaja = ingresosHoy - gastosHoy

    return (
      <div className="fin-goals-grid">
        {/* Card 1: Balance de Caja */}
        <div className="fin-card fin-goal-card">
          <div className="fin-goal-header">
            <div>
              <h3 className="fin-card-title">Balance de Caja Hoy</h3>
              <p className="fin-card-subtitle">
                Efectivo y ventas registradas durante el turno de hoy.
              </p>
            </div>
            <span className="fin-badge badge-teal">Caja Abierta</span>
          </div>

          <div className="fin-goal-body" style={{ marginTop: '12px' }}>
            <div className="goal-stats-col" style={{ width: '100%', display: 'flex', gap: '16px' }}>
              <div className="stat-box" style={{ flex: 1 }}>
                <span className="stat-box-label">Ingresos de Hoy</span>
                <strong className="stat-box-val text-teal">{currency.format(ingresosHoy)}</strong>
              </div>
              <div className="stat-box" style={{ flex: 1 }}>
                <span className="stat-box-label">Gastos de Hoy</span>
                <strong className="stat-box-val" style={{ color: '#ef4444' }}>{currency.format(gastosHoy)}</strong>
              </div>
            </div>
          </div>

          <div className="fin-goal-footer" style={{ marginTop: '16px' }}>
            <DollarSign size={14} />
            <span>Balance neto disponible hoy: <strong>{currency.format(saldoCaja)}</strong></span>
          </div>
        </div>

        {/* Card 2: Ventas por Canal Digital Hoy */}
        <div className="fin-card fin-goal-card flex-between-card">
          <div>
            <div className="fin-goal-icon-header">
              <div className="goal-icon-box green">
                <ShieldCheck size={18} />
              </div>
              <div className="goal-title-flex">
                <h3 className="fin-card-title">Cobros Digitales Hoy</h3>
                <p className="fin-card-subtitle">Pagos procesados por tarjeta / Stripe hoy.</p>
              </div>
            </div>

            <div className="emergency-fund-content" style={{ marginTop: '14px' }}>
              <div className="emergency-val-row">
                <strong className="emerg-curr">{currency.format(summary?.ingresos_tarjeta_hoy || 0)}</strong>
                <span className="emerg-target">{summary?.operaciones_hoy || 0} cobros</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Cobros en Efectivo Hoy */}
        <div className="fin-card fin-goal-card flex-between-card">
          <div>
            <div className="fin-goal-icon-header">
              <div className="goal-icon-box teal">
                <Package size={18} />
              </div>
              <div className="goal-title-flex">
                <h3 className="fin-card-title">Cobros en Efectivo Hoy</h3>
                <p className="fin-card-subtitle">Dinero físico ingresado a caja el día de hoy.</p>
              </div>
            </div>

            <div className="inventory-expansion-content" style={{ marginTop: '14px' }}>
              <div className="emergency-val-row">
                <strong className="emerg-curr" style={{ color: '#0d9488' }}>{currency.format(summary?.ingresos_efectivo_hoy || 0)}</strong>
                <span className="emerg-target">En física</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Vista Resumen Mensual
  const actualVentas = Number(summary?.ingresos_mes ?? 0)
  const metaVentas = 80000
  const pctVentas = Math.min(100, Math.round((actualVentas / metaVentas) * 100))
  const remanenteVentas = Math.max(0, metaVentas - actualVentas)

  return (
    <div className="fin-goals-grid">
      {/* Card 1: Meta de Ventas Mensual */}
      <div className="fin-card fin-goal-card">
        <div className="fin-goal-header">
          <div>
            <h3 className="fin-card-title">Meta de Ventas Mensual</h3>
            <p className="fin-card-subtitle">
              Objetivo: Generar S/ 80,000 en ventas netas antes del fin de mes.
            </p>
          </div>
          <span className="fin-badge badge-teal">En Progreso</span>
        </div>

        <div className="fin-goal-body">
          <div className="radial-progress-wrapper">
            <svg className="radial-progress-svg" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" className="radial-bg" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="radial-bar"
                strokeWidth="8"
                strokeDasharray={`${pctVentas * 2.51} 251`}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="radial-text">
              <strong className="radial-pct">{pctVentas}%</strong>
              <span className="radial-label">LOGRADO</span>
            </div>
          </div>

          <div className="goal-stats-col">
            <div className="stat-box">
              <span className="stat-box-label">Actual</span>
              <strong className="stat-box-val">{currency.format(actualVentas)}</strong>
            </div>
            <div className="stat-box">
              <span className="stat-box-label">Remanente</span>
              <strong className="stat-box-val">{currency.format(remanenteVentas)}</strong>
            </div>
          </div>
        </div>

        <div className="fin-goal-footer">
          <Calendar size={13} />
          <span>Resumen de metas del mes en curso</span>
        </div>
      </div>

      {/* Card 2: Fondo de Emergencia */}
      <div className="fin-card fin-goal-card flex-between-card">
        <div>
          <div className="fin-goal-icon-header">
            <div className="goal-icon-box green">
              <ShieldCheck size={18} />
            </div>
            <div className="goal-title-flex">
              <h3 className="fin-card-title">Fondo de Emergencia</h3>
              <p className="fin-card-subtitle">Reserva acumulada para contingencias.</p>
            </div>
          </div>

          <div className="emergency-fund-content">
            <div className="progress-label-row">
              <span className="prog-title">Progreso</span>
              <span className="prog-pct-green">42%</span>
            </div>
            <div className="fin-progress-bar-track">
              <div className="fin-progress-bar-fill green" style={{ width: '42%' }}></div>
            </div>
            <div className="emergency-val-row">
              <strong className="emerg-curr">S/ 4,200</strong>
              <span className="emerg-target">Meta: S/ 10,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Expansión de Inventario */}
      <div className="fin-card fin-goal-card flex-between-card">
        <div>
          <div className="fin-goal-icon-header">
            <div className="goal-icon-box teal">
              <Package size={18} />
            </div>
            <div className="goal-title-flex">
              <h3 className="fin-card-title">Expansión de Inventario</h3>
              <p className="fin-card-subtitle">Adquisición acumulada en el mes.</p>
            </div>
            <span className="fin-badge badge-teal">Casi Completado</span>
          </div>

          <div className="inventory-expansion-content">
            <div className="fin-progress-bar-track">
              <div className="fin-progress-bar-fill teal" style={{ width: '90%' }}></div>
            </div>

            <div className="expansion-three-stats">
              <div className="exp-stat-col">
                <span className="exp-label">Estado</span>
                <strong className="exp-val">En proceso</strong>
              </div>
              <div className="exp-stat-col">
                <span className="exp-label">Invertido</span>
                <strong className="exp-val teal-text">S/ 18,000</strong>
              </div>
              <div className="exp-stat-col">
                <span className="exp-label">Meta final</span>
                <strong className="exp-val">S/ 20,000</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
