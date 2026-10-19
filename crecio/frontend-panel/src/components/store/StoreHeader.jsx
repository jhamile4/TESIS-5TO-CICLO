import { ExternalLink } from 'lucide-react'
import { PUBLIC_URL } from '../../config/env'

export default function StoreHeader({ tiendaHref }) {
  return (
    <div className="store-page-header">
      <div>
        <h2>Mi tienda online</h2>
        <p>Así ven tu tienda tus clientes. Agrega fotos y compártela; tus datos se editan en Configuración.</p>
      </div>

      <div className="top-header-actions">
        <a href={tiendaHref || PUBLIC_URL} target="_blank" rel="noreferrer" className="btn-outline-action">
          <ExternalLink size={14} /> Ver mi tienda
        </a>
      </div>
    </div>
  )
}
