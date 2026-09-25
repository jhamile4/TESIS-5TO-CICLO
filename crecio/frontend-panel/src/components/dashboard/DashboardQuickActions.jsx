import { QrCode, Share2, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function DashboardQuickActions({ businessName }) {
  const navigate = useNavigate()

  return (
    <div className="dash-card dash-quick-card">
      <h3 className="dash-card-title">Acciones Rápidas</h3>

      <div className="quick-actions-list">
        <button className="quick-btn-item">
          <div className="quick-icon-box">
            {QrCode ? <QrCode size={18} /> : <span>QR</span>}
          </div>
          <div className="quick-text-box">
            <strong>Descargar QR</strong>
            <span>Para imprimir y compartir</span>
          </div>
        </button>

        <button className="quick-btn-item">
          <div className="quick-icon-box">
            {Share2 ? <Share2 size={18} /> : <span>🔗</span>}
          </div>
          <div className="quick-text-box">
            <strong>Compartir Link</strong>
            <span>crecio.app/{(businessName || 'tienda').toLowerCase().replace(/\s+/g, '')}</span>
          </div>
        </button>

        <button className="quick-btn-item" onClick={() => navigate('/marketing')}>
          <div className="quick-icon-box">
            {Sparkles ? <Sparkles size={18} /> : <span>✨</span>}
          </div>
          <div className="quick-text-box">
            <strong>Generar con IA</strong>
            <span>Descripción o post para redes</span>
          </div>
        </button>
      </div>
    </div>
  )
}
