import { currency } from '../../utils/formatters'

export default function DashboardSalesChart({ salesData }) {
  // Configuración de días predeterminados
  const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  
  const formattedData = Array.isArray(salesData) && salesData.length > 0
    ? salesData.map(item => {
        const d = new Date(item.fecha)
        // Adjust for timezone offset
        const localDate = new Date(d.getTime() + d.getTimezoneOffset() * 60000)
        const dayIdx = (localDate.getDay() + 6) % 7 // Monday = 0, Sunday = 6
        return {
          label: dayNames[dayIdx] || 'Día',
          total: Number(item.total) || 0
        }
      })
    : dayNames.map(d => ({ label: d, total: 0 }))

  const totalSemana = formattedData.reduce((acc, curr) => acc + curr.total, 0)
  const maxVal = Math.max(...formattedData.map(d => d.total), 10)

  // Calcule SVG coordinates (600 width, 180 height)
  // X range: 40 to 560
  // Y range: 140 (bottom) to 30 (top)
  const points = formattedData.map((d, idx) => {
    const x = 40 + idx * (520 / (formattedData.length - 1 || 1))
    const y = 140 - (d.total / maxVal) * 110
    return { x, y, ...d }
  })

  // Build SVG path
  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`
  }, '')

  const areaD = `${pathD} L ${points[points.length - 1].x},150 L ${points[0].x},150 Z`

  return (
    <div className="dash-card dash-chart-card">
      <div className="dash-card-header">
        <h3 className="dash-card-title">Ventas de la Semana</h3>
        <span className="dash-total-mint">{currency.format(totalSemana)} esta semana</span>
      </div>

      <div className="dash-chart-body">
        <svg className="dash-svg-line" viewBox="0 0 600 180" preserveAspectRatio="none">
          <defs>
            <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Lineas de guía */}
          <line x1="30" y1="30" x2="570" y2="30" stroke="#f1f5f9" strokeDasharray="4 4" />
          <line x1="30" y1="85" x2="570" y2="85" stroke="#f1f5f9" strokeDasharray="4 4" />
          <line x1="30" y1="140" x2="570" y2="140" stroke="#f1f5f9" strokeDasharray="4 4" />

          {/* Relleno bajo la curva */}
          <path d={areaD} fill="url(#salesGrad)" />

          {/* Línea principal */}
          <path
            d={pathD}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Puntos de datos */}
          {points.map((p, idx) => (
            <g key={idx}>
              <circle cx={p.x} cy={p.y} r="4.5" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" />
            </g>
          ))}
        </svg>

        <div className="dash-chart-days">
          {points.map((p, idx) => (
            <span key={idx}>{p.label}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
