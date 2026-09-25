export default function FinanceChart({ data }) {
  // Default values matching Figma or dynamic data
  const months = ['Ene', 'Feb', 'Mar', 'Abr']
  
  return (
    <div className="fin-card fin-chart-card">
      <div className="fin-chart-header">
        <h3 className="fin-card-title">Ingresos vs Gastos</h3>
        <div className="fin-chart-legend">
          <span className="legend-item">
            <span className="legend-dot green"></span> Ingresos
          </span>
          <span className="legend-item">
            <span className="legend-dot orange"></span> Gastos
          </span>
        </div>
      </div>

      <div className="fin-chart-wrapper">
        <svg className="fin-svg-chart" viewBox="0 0 750 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ingresosGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="gastosGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="40" y1="30" x2="710" y2="30" stroke="#f1f5f9" strokeDasharray="4 4" />
          <line x1="40" y1="80" x2="710" y2="80" stroke="#f1f5f9" strokeDasharray="4 4" />
          <line x1="40" y1="130" x2="710" y2="130" stroke="#f1f5f9" strokeDasharray="4 4" />

          {/* Gastos Area & Line (Orange) */}
          <path
            d="M 60,120 Q 250,118 450,115 T 700,112 L 700,170 L 60,170 Z"
            fill="url(#gastosGrad)"
          />
          <path
            d="M 60,120 Q 250,118 450,115 T 700,112"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Ingresos Area & Line (Teal/Green) */}
          <path
            d="M 60,90 Q 250,85 450,70 T 700,55 L 700,170 L 60,170 Z"
            fill="url(#ingresosGrad)"
          />
          <path
            d="M 60,90 Q 250,85 450,70 T 700,55"
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Key Data Points */}
          {/* Ingresos Dots */}
          <circle cx="60" cy="90" r="4" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" />
          <circle cx="270" cy="85" r="4" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" />
          <circle cx="490" cy="72" r="4" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" />
          <circle cx="700" cy="55" r="4" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" />

          {/* Gastos Dots */}
          <circle cx="60" cy="120" r="4" fill="#ffffff" stroke="#f59e0b" strokeWidth="2.5" />
          <circle cx="270" cy="118" r="4" fill="#ffffff" stroke="#f59e0b" strokeWidth="2.5" />
          <circle cx="490" cy="115" r="4" fill="#ffffff" stroke="#f59e0b" strokeWidth="2.5" />
          <circle cx="700" cy="112" r="4" fill="#ffffff" stroke="#f59e0b" strokeWidth="2.5" />
        </svg>

        {/* X Axis Labels */}
        <div className="fin-chart-axis">
          {months.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
