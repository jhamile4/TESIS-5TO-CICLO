import { useState } from 'react'
import { currency } from '../../utils/formatters'

// Colores validados para daltonismo y contraste (verde CRECIO e ámbar)
const SERIES = [
  { clave: 'ingresos', nombre: 'Ingresos', color: '#0d9488' },
  { clave: 'gastos', nombre: 'Gastos', color: '#d97706' },
]

const nombreMes = (fecha) =>
  new Date(fecha).toLocaleDateString('es-PE', { month: 'short', timeZone: 'UTC' }).replace('.', '')

// Redondea el máximo del eje a un número "limpio" (100, 250, 500, 1000...)
const techo = (valor) => {
  if (valor <= 0) return 100
  const base = 10 ** Math.floor(Math.log10(valor))
  return [1, 2, 2.5, 5, 10].map((m) => m * base).find((v) => v >= valor)
}

export default function FinanceChart({ data }) {
  const historial = data?.historial || []
  const [activo, setActivo] = useState(null)
  const maximo = techo(Math.max(0, ...historial.flatMap((h) => [h.ingresos, h.gastos])))
  const sinDatos = historial.every((h) => h.ingresos === 0 && h.gastos === 0)
  const lineas = [1, 0.5, 0]

  return (
    <div className="fin-card fin-chart-card">
      <div className="fin-chart-header">
        <h3 className="fin-card-title">Ingresos vs Gastos · últimos 6 meses</h3>
        <div className="fin-chart-legend" style={{ display: 'flex', gap: '14px' }}>
          {SERIES.map((s) => (
            <span key={s.clave} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: s.color }} /> {s.nombre}
            </span>
          ))}
        </div>
      </div>

      {sinDatos ? (
        <p style={{ margin: '40px 0', textAlign: 'center', fontSize: '13px', color: '#94a3b8' }}>
          Aún no hay ventas pagadas ni gastos registrados en los últimos 6 meses.
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr', gap: '8px', marginTop: '16px' }}>
          {/* Eje Y */}
          <div style={{ position: 'relative', height: '200px' }}>
            {lineas.map((f) => (
              <span key={f} style={{ position: 'absolute', right: 0, top: `${(1 - f) * 100}%`, transform: 'translateY(-50%)', fontSize: '11px', color: '#94a3b8' }}>
                {currency.format(maximo * f).replace(/\.00$/, '')}
              </span>
            ))}
          </div>

          <div>
            <div style={{ position: 'relative', height: '200px' }}>
              {lineas.map((f) => (
                <div key={f} style={{ position: 'absolute', left: 0, right: 0, top: `${(1 - f) * 100}%`, borderTop: f === 0 ? '1px solid #cbd5e1' : '1px dashed #eef2f6' }} />
              ))}

              <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: `repeat(${historial.length}, 1fr)` }}>
                {historial.map((h, i) => (
                  <div
                    key={h.mes}
                    onMouseEnter={() => setActivo(i)}
                    onMouseLeave={() => setActivo(null)}
                    style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '2px', background: activo === i ? '#f8fafc' : 'transparent', borderRadius: '6px' }}
                  >
                    {SERIES.map((s) => (
                      <div
                        key={s.clave}
                        style={{
                          width: '18px',
                          height: `${(h[s.clave] / maximo) * 100}%`,
                          minHeight: h[s.clave] > 0 ? '3px' : 0,
                          background: s.color,
                          borderRadius: '4px 4px 0 0',
                        }}
                      />
                    ))}

                    {activo === i && (
                      <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translate(-50%, -6px)', zIndex: 2, minWidth: '150px', padding: '8px 10px', borderRadius: '8px', background: '#0f172a', color: '#fff', fontSize: '12px', boxShadow: '0 6px 16px rgba(15,23,42,.2)', pointerEvents: 'none' }}>
                        <strong style={{ display: 'block', marginBottom: '4px', textTransform: 'capitalize' }}>{nombreMes(h.mes)}</strong>
                        {SERIES.map((s) => (
                          <div key={s.clave} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: s.color }} /> {s.nombre}
                            </span>
                            <span>{currency.format(h[s.clave])}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${historial.length}, 1fr)`, marginTop: '8px' }}>
              {historial.map((h) => (
                <span key={h.mes} style={{ textAlign: 'center', fontSize: '12px', color: '#64748b', textTransform: 'capitalize' }}>{nombreMes(h.mes)}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
