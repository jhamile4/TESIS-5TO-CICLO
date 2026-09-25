import { Calendar, ShieldCheck, Package, MoreHorizontal } from 'lucide-react'

export default function FinanceGoalsRow({ summary }) {
  const actualVentas = summary?.ingresos_mes ?? 0
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
              Objetivo: Generar S/ 80.000 en ventas netas antes del fin de mes.
            </p>
          </div>
          <span className="fin-badge badge-teal">En Progreso</span>
        </div>

        <div className="fin-goal-body">
          {/* Radial Donut Progress */}
          <div className="radial-progress-wrapper">
            <svg className="radial-progress-svg" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="radial-bg"
                strokeWidth="8"
              />
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

          {/* Breakdown Boxes */}
          <div className="goal-stats-col">
            <div className="stat-box">
              <span className="stat-box-label">Actual</span>
              <strong className="stat-box-val">S/ {(actualVentas / 1000).toFixed(1)}k</strong>
            </div>
            <div className="stat-box">
              <span className="stat-box-label">Remanente</span>
              <strong className="stat-box-val">S/ {(remanenteVentas / 1000).toFixed(1)}k</strong>
            </div>
          </div>
        </div>

        <div className="fin-goal-footer">
          <Calendar size={13} />
          <span>Quedan 6 días para finalizar el periodo</span>
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
              <p className="fin-card-subtitle">Reserva de capital para contingencias.</p>
            </div>
            <button className="icon-btn-ghost">
              <MoreHorizontal size={16} />
            </button>
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
              <p className="fin-card-subtitle">Adquisición de nueva línea de productos.</p>
            </div>
            <span className="fin-badge badge-teal">Casi Completado</span>
          </div>

          <div className="inventory-expansion-content">
            <div className="fin-progress-bar-track">
              <div className="fin-progress-bar-fill teal" style={{ width: '90%' }}></div>
            </div>

            <div className="expansion-three-stats">
              <div className="exp-stat-col">
                <span className="exp-label">Días restantes</span>
                <strong className="exp-val">5 días</strong>
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
