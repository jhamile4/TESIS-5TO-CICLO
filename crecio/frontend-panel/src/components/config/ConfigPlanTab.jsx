import { useEffect, useState } from 'react'
import { Crown, Check } from 'lucide-react'
import { getPlan } from '../../services/apiAdmin'
import { pagarProUrl } from '../../config/env'

const INCLUYE_PRO = [
  'Productos ilimitados',
  'IA ilimitada: textos e imágenes',
  'Publicar y programar en Facebook e Instagram',
  'Hasta 8 fotos en la galería de tu tienda',
  'Sin comisión por venta',
]

function BarraUso({ etiqueta, usado, limite }) {
  const porcentaje = limite ? Math.min(100, Math.round((usado / limite) * 100)) : 0
  const lleno = limite && usado >= limite
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
        <span>{etiqueta}</span>
        <strong style={{ color: lleno ? '#b45309' : '#0f172a' }}>
          {!limite ? `${usado} · sin límite` : usado > limite ? `${usado} (tu plan permite ${limite})` : `${usado} de ${limite}`}
        </strong>
      </div>
      {limite !== null && (
        <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
          <div style={{ width: `${porcentaje}%`, height: '100%', background: lleno ? '#d97706' : '#0d9488' }} />
        </div>
      )}
    </div>
  )
}

export default function ConfigPlanTab() {
  const [info, setInfo] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getPlan().then(setInfo).catch((err) => setError(err.message))
  }, [])

  if (error) return <div className="toast-error">{error}</div>
  if (!info) return <div className="config-card">Cargando tu plan…</div>

  const esPro = info.plan === 'pro'
  const vence = info.planExpira ? new Date(info.planExpira).toLocaleDateString('es-PE', { dateStyle: 'long' }) : null

  return (
    <div className="config-content-stack">
      <div className="config-card">
        <h4 className="config-card-title flex-title">
          <Crown size={18} className="title-icon-green" /> Tu plan: {esPro ? 'CRECIO Pro' : 'Gratis'}
        </h4>
        <p className="config-card-subtitle">
          {esPro
            ? (vence ? `Activo hasta el ${vence}. El pago es por adelantado y no se renueva solo.` : 'Activo.')
            : info.vencido
              ? 'Tu plan Pro venció. Tu tienda sigue funcionando con el plan Gratis y no perdiste nada.'
              : 'Tu tienda funciona gratis. Pásate a Pro cuando quieras vender más.'}
        </p>

        <BarraUso etiqueta="Productos" usado={info.uso.productos} limite={info.limites.productos} />
        <BarraUso etiqueta="Creaciones con IA este mes" usado={info.uso.usosIaMes} limite={info.limites.usosIaMes} />
        <BarraUso etiqueta="Fotos en la galería" usado={info.uso.fotosGaleria} limite={info.limites.fotosGaleria} />
        <p className="config-card-subtitle" style={{ margin: 0 }}>
          Publicar en Facebook e Instagram: <strong>{info.limites.publicarEnRedes ? 'incluido' : 'solo en Pro'}</strong>
        </p>
      </div>

      <div className="config-card" style={{ borderColor: '#99f6e4', background: '#f0fdfa' }}>
        <h4 className="config-card-title">{esPro ? 'Renovar CRECIO Pro' : 'Pásate a CRECIO Pro'}</h4>
        <p className="config-card-subtitle">
          S/ 39 al mes o S/ 390 al año (2 meses gratis). IGV incluido.
          {esPro && ' Si renuevas antes de que venza, los meses se suman.'}
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', display: 'grid', gap: '8px' }}>
          {INCLUYE_PRO.map((texto) => (
            <li key={texto} style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px' }}>
              <Check size={15} color="#0d9488" /> {texto}
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <a className="btn-ui-primary" href={pagarProUrl('mensual')} style={{ textDecoration: 'none' }}>Pagar S/ 39 · 1 mes</a>
          <a className="btn-ui-outline" href={pagarProUrl('anual')} style={{ textDecoration: 'none' }}>Pagar S/ 390 · 1 año</a>
        </div>
      </div>
    </div>
  )
}
