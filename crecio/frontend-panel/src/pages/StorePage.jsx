import { useEffect, useState } from 'react'
import { Smartphone, Monitor } from 'lucide-react'
import { getTienda } from '../services/apiAdmin'
import { tiendaUrl, sinProtocolo } from '../config/env'

import StoreHeader from '../components/store/StoreHeader'
import StoreSidePanel from '../components/store/StoreSidePanel'
import StorePreviewMobile from '../components/store/StorePreviewMobile'
import StorePreviewDesktop from '../components/store/StorePreviewDesktop'
import StoreStatsSidebar from '../components/store/StoreStatsSidebar'

// La tienda pública de CRECIO es blanca con acento verde: la vista previa usa ese mismo estilo
const TEMA_TIENDA = { id: 'crecio', name: 'CRECIO', bg: '#ffffff', text: '#111827', accent: '#0d9488', cardBg: '#f9fafb' }
const BOTONES_TIENDA = { id: 'redondeado', name: 'Redondeado', radius: '12px' }

export default function StorePage() {
  const [data, setData] = useState(null)
  const [deviceMode, setDeviceMode] = useState('movil')
  const [error, setError] = useState('')

  useEffect(() => {
    getTienda().then(setData).catch((err) => setError(err.message))
  }, [])

  const negocio = data?.negocio
  const url = negocio?.pk_id ? tiendaUrl(negocio.pk_id) : ''
  const redes = negocio?.redes_sociales || {}

  // Datos reales del negocio para la vista previa (se editan en Configuración)
  const form = {
    nombre: negocio?.nombre || '',
    slogan: negocio?.descripcion || '',
    whatsapp: negocio?.whatsapp || '',
    direccion: [negocio?.direccion, negocio?.distrito].filter(Boolean).join(', '),
    logoUrl: negocio?.logo_url || '',
    instagram: redes.instagram || '',
    facebook: redes.facebook || '',
  }
  // Solo se muestran en la vista previa las partes que la tienda realmente tiene
  const sections = {
    portada: true,
    catalogo: true,
    whatsapp: Boolean(form.whatsapp),
    redes: Boolean(redes.instagram || redes.facebook),
    ubicacion: Boolean(form.direccion),
  }
  const sampleProducts = (data?.productos || []).slice(0, 3)
  const vistaProps = { selectedTheme: TEMA_TIENDA, selectedBtnStyle: BOTONES_TIENDA, selectedFont: 'inherit', form, sections, sampleProducts }

  return (
    <section className="store-page-wrapper">
      <StoreHeader tiendaHref={url || undefined} />

      {error && <div className="toast-error">{error}</div>}

      <div className="store-main-layout">
        <StoreSidePanel url={url} nombre={negocio?.nombre} />

        <div className="store-preview-area">
          <div className="preview-top-toolbar">
            <div className="device-switcher-pill">
              <button className={deviceMode === 'movil' ? 'active' : ''} onClick={() => setDeviceMode('movil')}>
                <Smartphone size={14} /> Móvil
              </button>
              <button className={deviceMode === 'escritorio' ? 'active' : ''} onClick={() => setDeviceMode('escritorio')}>
                <Monitor size={14} /> Escritorio
              </button>
            </div>
            <div className="domain-url-preview">{url ? sinProtocolo(url) : ''}</div>
          </div>

          <div className="preview-device-container">
            {deviceMode === 'movil'
              ? <StorePreviewMobile {...vistaProps} />
              : <StorePreviewDesktop {...vistaProps} tiendaLink={url ? sinProtocolo(url) : ''} />}
          </div>
        </div>

        <StoreStatsSidebar estadisticas={data?.estadisticas} />
      </div>
    </section>
  )
}
