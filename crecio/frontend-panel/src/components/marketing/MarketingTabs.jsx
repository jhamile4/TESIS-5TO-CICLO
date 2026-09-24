import { WandSparkles, CalendarDays, CheckCircle2, FileText } from 'lucide-react'

export default function MarketingTabs({ activeMainTab, setActiveMainTab, scheduledCount }) {
  return (
    <div className="marketing-main-tabs">
      <button
        className={`m-tab ${activeMainTab === 'crear' ? 'active' : ''}`}
        onClick={() => setActiveMainTab('crear')}
      >
        <WandSparkles size={15} />
        Crear & Publicar
      </button>
      <button
        className={`m-tab ${activeMainTab === 'programadas' ? 'active' : ''}`}
        onClick={() => setActiveMainTab('programadas')}
      >
        <CalendarDays size={15} />
        Programadas
        <span className="tab-badge">{scheduledCount}</span>
      </button>
      <button
        className={`m-tab ${activeMainTab === 'publicadas' ? 'active' : ''}`}
        onClick={() => setActiveMainTab('publicadas')}
      >
        <CheckCircle2 size={15} />
        Publicadas
      </button>
      <button
        className={`m-tab ${activeMainTab === 'borradores' ? 'active' : ''}`}
        onClick={() => setActiveMainTab('borradores')}
      >
        <FileText size={15} />
        Borradores
      </button>
    </div>
  )
}
