import { useState } from 'react'
import { Sparkles, ImagePlus, WandSparkles, Check, RefreshCw, Palette, Link2, ExternalLink, ShieldCheck, X } from 'lucide-react'

const quickPrompts = [
  '🔥 Oferta relámpago con 20% de descuento',
  '🛍️ Presentación de nuevo producto estrella',
  '🎬 Reel tutorial de 3 formas de usar el producto',
  '⭐ Testimonio real de un cliente satisfecho'
]

export default function MarketingEditorCol({
  templates,
  tipo,
  setTipo,
  prompt,
  setPrompt,
  uploadedImage,
  handleImageUpload,
  generateImageIa,
  loadingImage,
  tones,
  tono,
  setTono,
  contentType,
  loading,
  error,
  generate,
  accounts,
  activeAccountsList,
  toggleAccount,
  onConnectAccount,
  onStartMetaAuth,
  onManualTokenConnect,
  business
}) {
  const [connectModalAcc, setConnectModalAcc] = useState(null)
  const [handleInput, setHandleInput] = useState('')
  const [connecting, setConnecting] = useState(false)

  const openConnectModal = (acc) => {
    setConnectModalAcc(acc)
    setHandleInput(acc.handle !== 'Sin conectar' ? acc.handle : '')
  }

  const handleSaveConnection = async (e) => {
    e.preventDefault()
    if (!connectModalAcc) return
    setConnecting(true)
    try {
      await onConnectAccount({
        plataforma: connectModalAcc.id,
        nombreCuenta: connectModalAcc.name,
        handle: handleInput || `@${connectModalAcc.name.toLowerCase()}`,
        estado: 'conectado'
      })
      alert(`✅ ¡Cuenta de ${connectModalAcc.name} vinculada exitosamente!`)
      setConnectModalAcc(null)
    } catch (err) {
      alert('Error al conectar la cuenta')
    } finally {
      setConnecting(false)
    }
  }

  return (
    <div className="marketing-col-left">
      {/* Plantilla de contenido */}
      <div className="m-card">
        <h3>Plantilla de contenido</h3>
        <div className="template-button-grid">
          {templates.map((item) => (
            <button
              key={item}
              className={`template-btn ${tipo === item ? 'selected' : ''}`}
              onClick={() => setTipo(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt de IA */}
      <div className="m-card">
        <div className="m-card-title">
          <Sparkles size={16} className="text-teal" />
          <h3>Prompt de IA</h3>
        </div>

        <div className="quick-prompts-row">
          <small>Sugerencias rápidas:</small>
          <div className="quick-pills">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                type="button"
                className="quick-pill-btn"
                onClick={() => setPrompt(qp)}
              >
                {qp}
              </button>
            ))}
          </div>
        </div>

        <div className="prompt-area-wrap">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe tu producto, campaña o idea para que la IA genere el contenido perfecto..."
            maxLength={500}
          />
          <span className="prompt-counter">{prompt.length}/500</span>
        </div>

        <div className="image-action-box">
          <label className="image-upload-dashed">
            <ImagePlus size={16} />
            <span>{uploadedImage ? 'Cambiar imagen subida' : 'Subir imagen propia (opcional)'}</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </label>

          <button
            type="button"
            className="ai-gen-img-btn"
            disabled={loadingImage || loading}
            onClick={generateImageIa}
          >
            {loadingImage ? <RefreshCw size={14} className="spin" /> : <Palette size={14} />}
            {loadingImage ? 'Generando Imagen IA...' : 'Generar Imagen Publicitaria con IA'}
          </button>
        </div>

        <div className="tone-pills-row">
          {tones.map((item) => (
            <button
              key={item}
              className={`tone-btn ${tono === item ? 'selected' : ''}`}
              onClick={() => setTono(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <button
          className={`generate-cta-btn ${contentType?.includes('Video') || contentType?.includes('Reel') ? 'video-mode' : ''}`}
          disabled={loading}
          onClick={generate}
        >
          <WandSparkles size={16} />
          {loading
            ? 'Generando todo con IA...'
            : contentType?.includes('Video') || contentType?.includes('Reel')
            ? 'Generar Guión + Audio + Post con IA'
            : contentType === 'Story'
            ? 'Generar Story 9:16 con IA'
            : 'Generar Publicación Completa con IA'}
        </button>

        {error && <p className="m-error-msg">{error}</p>}
      </div>

      {/* Canales de Publicación Directa */}
      <div className="m-card">
        <div className="m-card-header-flex">
          <div>
            <h3 style={{ margin: 0 }}>Publicar en tus Redes</h3>
            <small style={{ color: '#64748b', fontSize: '11px' }}>Instagram, Facebook, TikTok y WhatsApp</small>
          </div>
          <span className="active-accounts-count">{activeAccountsList.length} activas</span>
        </div>

        {/* Status de Cuentas */}
        {(() => {
          const isMetaConnected = accounts.some(
            (a) => (a.id === 'instagram' || a.id === 'facebook') && a.connected
          )
          return (
            <div style={{
              background: isMetaConnected ? '#f0fdf4' : '#f8fafc',
              border: `1px solid ${isMetaConnected ? '#bbf7d0' : '#e2e8f0'}`,
              borderRadius: '10px',
              padding: '12px',
              margin: '12px 0 14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '14px' }}>{isMetaConnected ? '🟢' : '⚪'}</span>
                  <strong style={{ fontSize: '12px', color: '#0f172a' }}>
                    {isMetaConnected ? 'Cuentas vinculadas para publicar' : 'Publicación en tus redes'}
                  </strong>
                </div>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: isMetaConnected ? '#dcfce7' : '#e2e8f0',
                  color: isMetaConnected ? '#15803d' : '#64748b'
                }}>
                  {isMetaConnected ? 'Publicación en Vivo' : 'Modo de Prueba activo'}
                </span>
              </div>

              <p style={{ margin: '0 0 10px', fontSize: '11px', color: '#64748b', lineHeight: 1.4 }}>
                {isMetaConnected
                  ? 'Tus publicaciones se subirán directamente al perfil de Instagram y Facebook de tu negocio.'
                  : 'Puedes publicar en Modo de Prueba (se guardará en tu historial del panel), o conectar tus redes para publicar en vivo con 1 clic.'}
              </p>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={onStartMetaAuth}
                  style={{
                    flex: 1,
                    minWidth: '140px',
                    padding: '7px 10px',
                    background: '#0d9488',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <Link2 size={12} /> {isMetaConnected ? 'Reconectar Cuentas' : 'Conectar Facebook / Instagram'}
                </button>
                <button
                  type="button"
                  onClick={onManualTokenConnect}
                  style={{
                    padding: '7px 10px',
                    background: '#334155',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Activar con token de prueba"
                >
                  🧪 Modo Prueba
                </button>
              </div>
            </div>
          )
        })()}

        <div className="accounts-list">
          {accounts.map((acc) => {
            const isMeta = acc.id === 'instagram' || acc.id === 'facebook'
            return (
              <div
                key={acc.id}
                className={`account-item ${acc.active ? 'active-acc' : ''} ${!acc.connected ? 'disabled-acc' : ''}`}
                onClick={() => {
                  if (!acc.connected) {
                    openConnectModal(acc)
                  } else {
                    toggleAccount(acc.id)
                  }
                }}
              >
                <div className="acc-info">
                  <div className="acc-icon-badge" style={{ backgroundColor: acc.color + '15', color: acc.color }}>
                    {acc.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <strong>{acc.name}</strong>
                      {isMeta && <span style={{ fontSize: '9px', background: '#e0e7ff', color: '#3730a3', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>Directo</span>}
                      {acc.id === 'tiktok' && <span style={{ fontSize: '9px', background: '#f1f5f9', color: '#475569', padding: '1px 5px', borderRadius: '4px' }}>Video Asistido</span>}
                    </div>
                    <small>{acc.connected ? acc.handle : 'Clic para activar o vincular'}</small>
                  </div>
                </div>
                <div className="acc-action-right">
                  {!acc.connected ? (
                    <button type="button" className="btn-connect-sm" onClick={(e) => { e.stopPropagation(); openConnectModal(acc); }}>
                      <Link2 size={12} /> Activar
                    </button>
                  ) : (
                    <div className={`acc-checkbox ${acc.active ? 'checked' : ''}`}>
                      {acc.active && <Check size={12} />}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* MODAL DE CONEXIÓN DE REDES SOCIALES */}
      {connectModalAcc && (
        <div className="modal-overlay-marketing" onClick={() => setConnectModalAcc(null)}>
          <div className="modal-box-marketing" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-marketing">
              <div className="modal-title-flex">
                <div className="acc-icon-badge-lg" style={{ backgroundColor: connectModalAcc.color + '20', color: connectModalAcc.color }}>
                  {connectModalAcc.name.charAt(0)}
                </div>
                <div>
                  <h4>Conectar cuenta: {connectModalAcc.name}</h4>
                  <p>Vincula la cuenta de tu negocio para publicar en 1 clic</p>
                </div>
              </div>
              <button className="btn-close-modal" onClick={() => setConnectModalAcc(null)}><X size={18} /></button>
            </div>

            <div className="modal-body-marketing">
              {(connectModalAcc.id === 'instagram' || connectModalAcc.id === 'facebook') ? (
                <>
                  <div className="oauth-method-box">
                    <ShieldCheck size={20} className="text-teal" />
                    <div>
                      <strong>Conectar cuenta de {connectModalAcc.name}</strong>
                      <small>Inicio de sesión seguro para publicar fotos y videos en el perfil de tu negocio.</small>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-oauth-official"
                    style={{ backgroundColor: '#1877f2', marginBottom: '8px' }}
                    onClick={() => {
                      setConnectModalAcc(null)
                      onStartMetaAuth?.()
                    }}
                  >
                    <ExternalLink size={15} /> Iniciar sesión en {connectModalAcc.name}
                  </button>

                  <button
                    type="button"
                    className="btn-oauth-official"
                    style={{ backgroundColor: '#334155', marginBottom: '14px' }}
                    onClick={() => {
                      setConnectModalAcc(null)
                      onManualTokenConnect?.()
                    }}
                  >
                    🧪 Activar con cuenta de prueba
                  </button>

                  <div className="divider-or"><span>O escribir nombre de cuenta manual</span></div>
                </>
              ) : (
                <div className="oauth-method-box" style={{ background: '#f8fafc' }}>
                  <Sparkles size={20} className="text-teal" />
                  <div>
                    <strong>Canal de Distribución Asistido</strong>
                    <small>Genera texto, guión o formato optimizado para {connectModalAcc.name}.</small>
                  </div>
                </div>
              )}

              <form onSubmit={handleSaveConnection} className="manual-handle-form">
                <label>Nombre de usuario / Handle del negocio (@)</label>
                <input
                  type="text"
                  placeholder={`Ej: @${business?.nombre?.toLowerCase()?.replace(/\s+/g, '') || connectModalAcc.name.toLowerCase()}`}
                  value={handleInput}
                  onChange={(e) => setHandleInput(e.target.value)}
                  required
                />
                <button type="submit" className="btn-save-handle" disabled={connecting}>
                  {connecting ? 'Guardando...' : 'Activar Canal para Publicar'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


