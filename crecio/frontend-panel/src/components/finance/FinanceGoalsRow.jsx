import { useState } from 'react'
import { Calendar, ShieldCheck, Package, DollarSign, Pencil } from 'lucide-react'
import { currency } from '../../utils/formatters'

export default function FinanceGoalsRow({ summary, isMonth, onGuardarMeta }) {
  const [editandoMeta, setEditandoMeta] = useState(false)
  const [metaInput, setMetaInput] = useState('')
  const [guardando, setGuardando] = useState(false)

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

  // Vista Resumen Mensual: todo sale de las ventas y gastos reales del mes
  const actualVentas = Number(summary?.ingresos_mes ?? 0)
  const gastosMes = Number(summary?.gastos_mes ?? 0)
  const operacionesMes = Number(summary?.operaciones_mes ?? 0)
  const metaVentas = Number(summary?.meta_ventas_mes ?? 0)
  const tieneMeta = metaVentas > 0
  const pctVentas = tieneMeta ? Math.min(100, Math.round((actualVentas / metaVentas) * 100)) : 0
  const remanenteVentas = Math.max(0, metaVentas - actualVentas)
  const ganancia = actualVentas - gastosMes
  const margen = actualVentas > 0 ? Math.round((ganancia / actualVentas) * 100) : 0
  const ticketPromedio = operacionesMes > 0 ? actualVentas / operacionesMes : 0

  const guardar = async () => {
    setGuardando(true)
    try {
      await onGuardarMeta(Number(metaInput) || 0)
      setEditandoMeta(false)
    } catch (err) {
      alert(err.message)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="fin-goals-grid">
      {/* Card 1: Meta de Ventas Mensual (la define el dueño) */}
      <div className="fin-card fin-goal-card">
        <div className="fin-goal-header">
          <div>
            <h3 className="fin-card-title">Meta de Ventas Mensual</h3>
            <p className="fin-card-subtitle">
              {tieneMeta ? `Objetivo: ${currency.format(metaVentas)} en ventas este mes.` : 'Aún no defines una meta para este mes.'}
            </p>
          </div>
          {!editandoMeta && (
            <button
              type="button"
              className="fin-badge badge-teal"
              style={{ border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              onClick={() => { setMetaInput(tieneMeta ? String(metaVentas) : ''); setEditandoMeta(true) }}
            >
              <Pencil size={11} /> {tieneMeta ? 'Cambiar' : 'Definir meta'}
            </button>
          )}
        </div>

        {editandoMeta ? (
          <div style={{ display: 'flex', gap: '8px', marginTop: '14px', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, color: '#475569' }}>S/</span>
            <input
              type="number"
              min="0"
              step="100"
              value={metaInput}
              onChange={(e) => setMetaInput(e.target.value)}
              placeholder="Ej: 5000"
              autoFocus
              style={{ flex: 1, padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
            <button type="button" className="btn-ui-primary" onClick={guardar} disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
            <button type="button" className="btn-ui-outline" onClick={() => setEditandoMeta(false)}>Cancelar</button>
          </div>
        ) : (
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
                <strong className="radial-pct">{tieneMeta ? `${pctVentas}%` : '—'}</strong>
                <span className="radial-label">LOGRADO</span>
              </div>
            </div>

            <div className="goal-stats-col">
              <div className="stat-box">
                <span className="stat-box-label">Vendido</span>
                <strong className="stat-box-val">{currency.format(actualVentas)}</strong>
              </div>
              <div className="stat-box">
                <span className="stat-box-label">Falta</span>
                <strong className="stat-box-val">{tieneMeta ? currency.format(remanenteVentas) : '—'}</strong>
              </div>
            </div>
          </div>
        )}

        <div className="fin-goal-footer">
          <Calendar size={13} />
          <span>Mes en curso · ventas pagadas</span>
        </div>
      </div>

      {/* Card 2: Ganancia del mes */}
      <div className="fin-card fin-goal-card flex-between-card">
        <div>
          <div className="fin-goal-icon-header">
            <div className="goal-icon-box green">
              <ShieldCheck size={18} />
            </div>
            <div className="goal-title-flex">
              <h3 className="fin-card-title">Ganancia del Mes</h3>
              <p className="fin-card-subtitle">Ventas pagadas menos gastos registrados.</p>
            </div>
          </div>

          <div className="emergency-fund-content">
            <div className="progress-label-row">
              <span className="prog-title">Margen</span>
              <span className="prog-pct-green" style={{ color: ganancia < 0 ? '#ef4444' : undefined }}>{margen}%</span>
            </div>
            <div className="fin-progress-bar-track">
              <div className="fin-progress-bar-fill green" style={{ width: `${Math.max(0, Math.min(100, margen))}%` }}></div>
            </div>
            <div className="emergency-val-row">
              <strong className="emerg-curr" style={{ color: ganancia < 0 ? '#ef4444' : undefined }}>{currency.format(ganancia)}</strong>
              <span className="emerg-target">Gastos: {currency.format(gastosMes)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Ticket promedio */}
      <div className="fin-card fin-goal-card flex-between-card">
        <div>
          <div className="fin-goal-icon-header">
            <div className="goal-icon-box teal">
              <Package size={18} />
            </div>
            <div className="goal-title-flex">
              <h3 className="fin-card-title">Ticket Promedio</h3>
              <p className="fin-card-subtitle">Cuánto gasta en promedio cada cliente por compra.</p>
            </div>
          </div>

          <div className="inventory-expansion-content">
            <div className="expansion-three-stats">
              <div className="exp-stat-col">
                <span className="exp-label">Promedio</span>
                <strong className="exp-val teal-text">{currency.format(ticketPromedio)}</strong>
              </div>
              <div className="exp-stat-col">
                <span className="exp-label">Ventas</span>
                <strong className="exp-val">{operacionesMes}</strong>
              </div>
              <div className="exp-stat-col">
                <span className="exp-label">Total</span>
                <strong className="exp-val">{currency.format(actualVentas)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
