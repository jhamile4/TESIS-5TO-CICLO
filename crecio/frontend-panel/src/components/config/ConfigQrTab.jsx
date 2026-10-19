import { Download, Copy } from 'lucide-react'
import { useState } from 'react'
import { tiendaUrl, sinProtocolo, qrUrl } from '../../config/env'

export default function ConfigQrTab({ negocioId }) {
  const [copiado, setCopiado] = useState(false)
  if (!negocioId) return null

  const url = tiendaUrl(negocioId)
  const imagenQr = qrUrl(url)

  const copiar = async () => {
    await navigator.clipboard.writeText(url)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 1800)
  }

  return (
    <div className="config-card config-card-centered">
      <h4 className="config-card-title flex-center">Código QR de tu Negocio</h4>
      <p className="config-card-subtitle text-center">
        Los clientes escanean este código y entran directo a tu tienda en CRECIO.
      </p>
      <div className="qr-code-box">
        <img src={imagenQr} alt="Código QR de la tienda" className="qr-code-img" />
        <strong className="qr-slug-text">{sinProtocolo(url)}</strong>
      </div>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '14px', flexWrap: 'wrap' }}>
        <a className="btn-ui-primary" href={`${imagenQr}&format=png`} download="qr-mi-tienda.png" target="_blank" rel="noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
          <Download size={14} /> Descargar QR
        </a>
        <button type="button" className="btn-ui-outline" onClick={copiar} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Copy size={14} /> {copiado ? '¡Enlace copiado!' : 'Copiar enlace'}
        </button>
      </div>
      <p className="config-card-subtitle text-center" style={{ marginTop: '10px', fontSize: '11px' }}>
        Mientras CRECIO funcione en tu computadora (localhost), el QR solo abre en ella. Al publicarlo en internet, funcionará en cualquier celular.
      </p>
    </div>
  )
}
