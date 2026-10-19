import { PenLine, CalendarDays, CheckCircle2 } from 'lucide-react'

export default function MarketingTabs({ activeMainTab, setActiveMainTab, scheduledCount }) {
  const pestañas = [
    ['crear', 'Crear', PenLine],
    ['programadas', 'Programadas', CalendarDays],
    ['publicadas', 'Publicadas', CheckCircle2],
  ]

  return (
    <div className="marketing-main-tabs">
      {pestañas.map(([id, texto, Icon]) => (
        <button key={id} className={`m-tab ${activeMainTab === id ? 'active' : ''}`} onClick={() => setActiveMainTab(id)}>
          <Icon size={15} />
          {texto}
          {id === 'programadas' && scheduledCount > 0 && <span className="tab-badge">{scheduledCount}</span>}
        </button>
      ))}
    </div>
  )
}
