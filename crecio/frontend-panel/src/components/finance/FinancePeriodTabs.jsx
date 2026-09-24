export default function FinancePeriodTabs({ period, setPeriod }) {
  return (
    <div className="finance-period-tabs">
      <button
        className={`period-btn ${period === 'day' ? 'active' : ''}`}
        onClick={() => setPeriod('day')}
      >
        Caja del Día
      </button>
      <button
        className={`period-btn ${period === 'month' ? 'active' : ''}`}
        onClick={() => setPeriod('month')}
      >
        Resumen Mensual
      </button>
    </div>
  )
}
