import { ExternalLink, WandSparkles } from 'lucide-react'
import { PUBLIC_URL } from '../../config/env'

export default function StoreHeader({ saving, onSave }) {
  return (
    <div className="store-page-header">
      <div>
        <h2>Mi Tienda Online</h2>
        <p>Personaliza y publica tu landing page en minutos</p>
      </div>

      <div className="top-header-actions">
        <a
          href={PUBLIC_URL}
          target="_blank"
          rel="noreferrer"
          className="btn-outline-action"
        >
          <ExternalLink size={14} /> Ver en vivo
        </a>
        <button className="btn-teal-action" onClick={onSave} disabled={saving}>
          <WandSparkles size={14} /> {saving ? 'Guardando...' : 'Publicar con IA'}
        </button>
      </div>
    </div>
  )
}
