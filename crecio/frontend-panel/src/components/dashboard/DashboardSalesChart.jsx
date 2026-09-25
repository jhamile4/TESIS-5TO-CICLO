export default function DashboardSalesChart() {
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

  return (
    <div className="dash-card dash-chart-card">
      <div className="dash-card-header">
        <h3 className="dash-card-title">Ventas de la Semana</h3>
        <span className="dash-total-mint">S/ 34,800 total</span>
      </div>

      <div className="dash-chart-body">
        <svg className="dash-svg-line" viewBox="0 0 600 180" preserveAspectRatio="none">
          <defs>
            <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="30" y1="30" x2="570" y2="30" stroke="#f1f5f9" strokeDasharray="4 4" />
          <line x1="30" y1="75" x2="570" y2="75" stroke="#f1f5f9" strokeDasharray="4 4" />
          <line x1="30" y1="120" x2="570" y2="120" stroke="#f1f5f9" strokeDasharray="4 4" />

          {/* Fill Area under curve */}
          <path
            d="M 40,120 Q 120,95 200,110 T 360,75 T 480,45 T 560,110 L 560,150 L 40,150 Z"
            fill="url(#salesGrad)"
          />

          {/* Curved Line */}
          <path
            d="M 40,120 Q 120,95 200,110 T 360,75 T 480,45 T 560,110"
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Data Dots */}
          <circle cx="40" cy="120" r="4.5" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" />
          <circle cx="125" cy="95" r="4.5" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" />
          <circle cx="210" cy="110" r="4.5" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" />
          <circle cx="295" cy="85" r="4.5" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" />
          <circle cx="380" cy="75" r="4.5" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" />
          <circle cx="470" cy="45" r="4.5" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" />
          <circle cx="560" cy="110" r="4.5" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" />
        </svg>

        <div className="dash-chart-days">
          {days.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
