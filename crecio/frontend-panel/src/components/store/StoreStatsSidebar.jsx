import { Eye, MessageSquare, Share } from 'lucide-react'

export default function StoreStatsSidebar() {
  return (
    <div className="store-stats-sidebar">
      <div className="status-card-box">
        <h4>Estado de tu tienda</h4>
        <div className="status-pill-badge yellow">
          <span className="status-dot"></span> Borrador
        </div>
      </div>

      <div className="stats-card-box">
        <h4>Estadísticas</h4>

        <div className="stat-metric-row">
          <div className="stat-label">
            <Eye size={14} className="text-teal" />
            <span>Visitas hoy</span>
          </div>
          <strong>128</strong>
        </div>

        <div className="stat-metric-row">
          <div className="stat-label">
            <MessageSquare size={14} className="text-green" />
            <span>Clics WhatsApp</span>
          </div>
          <strong>24</strong>
        </div>

        <div className="stat-metric-row">
          <div className="stat-label">
            <Share size={14} className="text-blue" />
            <span>Compartidos</span>
          </div>
          <strong>7</strong>
        </div>
      </div>
    </div>
  )
}
