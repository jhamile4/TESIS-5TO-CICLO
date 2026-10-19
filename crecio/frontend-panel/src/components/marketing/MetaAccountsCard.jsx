import { Check, KeyRound, Link2, Unplug } from 'lucide-react'
import { InstagramIcon, FacebookIcon } from '../common/SocialIcons'

const ICONOS = { facebook: FacebookIcon, instagram: InstagramIcon }

// Cuentas de Meta donde se puede publicar de verdad (vinculadas con token desde "Conectar con Meta")
export default function MetaAccountsCard({ accounts, toggleAccount, onStartMetaAuth, onManualTokenConnect, onDisconnect }) {
  const conectadas = accounts.filter((acc) => acc.connected)

  return (
    <div className="m-card">
      <div className="m-card-header-flex">
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Publicar en</h3>
        <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>
          {accounts.filter((a) => a.connected && a.active).length} seleccionadas
        </span>
      </div>

      <div className="accounts-list">
        {accounts.map((acc) => {
          const Icon = ICONOS[acc.id]
          return (
            <div
              key={acc.id}
              className="account-item-figma"
              onClick={() => acc.connected && toggleAccount(acc.id)}
              style={{ cursor: acc.connected ? 'pointer' : 'default', opacity: acc.connected ? 1 : 0.7 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${acc.color}15`, color: acc.color, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  {Icon && <Icon size={18} />}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <strong style={{ display: 'block', fontSize: '13px', color: '#0f172a', fontWeight: 700 }}>
                    {acc.id === 'facebook' ? 'Página de Facebook' : 'Instagram profesional'}
                  </strong>
                  <small style={{ display: 'block', fontSize: '11px', color: acc.connected ? '#64748b' : '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {acc.connected ? acc.handle : 'Sin conectar · usa los botones de abajo'}
                  </small>
                </div>
              </div>

              {acc.connected && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    title="Desconectar esta cuenta"
                    onClick={(e) => { e.stopPropagation(); onDisconnect(acc) }}
                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
                  >
                    <Unplug size={14} />
                  </button>
                  <div
                    title={acc.active ? 'Se publicará aquí (clic para quitar)' : 'No se publicará aquí (clic para incluir)'}
                    style={{ width: '22px', height: '22px', borderRadius: '50%', background: acc.active ? '#0f172a' : 'transparent', border: acc.active ? 'none' : '1.5px solid #cbd5e1', display: 'grid', placeItems: 'center', color: '#ffffff' }}
                  >
                    {acc.active && <Check size={11} strokeWidth={3.5} />}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <button
        type="button"
        onClick={onStartMetaAuth}
        className="btn-ui-primary"
        style={{ width: '100%', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#1877f2' }}
      >
        <Link2 size={15} />
        {conectadas.length > 0 ? 'Volver a conectar con Meta' : 'Conectar con Meta (Facebook + Instagram)'}
      </button>

      <button
        type="button"
        onClick={onManualTokenConnect}
        className="btn-ui-outline"
        style={{ width: '100%', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
      >
        <KeyRound size={15} />
        Pegar token de Meta (Graph API Explorer)
      </button>

      <div style={{ marginTop: '10px', padding: '8px 10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9', fontSize: '11px', color: '#64748b', lineHeight: 1.5 }}>
        Necesitas una <strong>Página de Facebook</strong> (no un perfil personal) y, para Instagram,
        una <strong>cuenta profesional</strong> vinculada a esa Página. TikTok y WhatsApp no permiten
        publicar desde otras apps: copia el texto y súbelo a mano.
      </div>
    </div>
  )
}
