import { QrCode, Share2, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { tiendaUrl, sinProtocolo } from '../../config/env'

export default function DashboardQuickActions({ negocioId }) {
  const navigate = useNavigate()
  const [copiado, setCopiado] = useState(false)
  const url = negocioId ? tiendaUrl(negocioId) : ''

  // En el celular abre el menú de compartir; en la computadora copia el enlace
  const compartir = async () => {
    if (!url) return
    if (navigator.share) {
      await navigator.share({ title: 'Mi tienda en CRECIO', url }).catch(() => {})
      return
    }
    await navigator.clipboard.writeText(url)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 1800)
  }

  return (
    <div className="dash-card dash-quick-card">
      <h3 className="dash-card-title">Acciones Rápidas</h3>

      <div className="quick-actions-list">
        <button className="quick-btn-item" onClick={() => navigate('/configuracion?tab=qr')}>
          <div className="quick-icon-box">
            {QrCode ? <QrCode size={18} /> : <span>QR</span>}
          </div>
          <div className="quick-text-box">
            <strong>Descargar QR</strong>
            <span>Para imprimir y compartir</span>
          </div>
        </button>

        <button className="quick-btn-item" onClick={compartir}>
          <div className="quick-icon-box">
            {Share2 ? <Share2 size={18} /> : <span>🔗</span>}
          </div>
          <div className="quick-text-box">
            <strong>{copiado ? '¡Enlace copiado!' : 'Compartir enlace'}</strong>
            <span>{url ? sinProtocolo(url) : 'Tu tienda en CRECIO'}</span>
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
