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

      {/* Cuentas Conectadas */}
      <div className="m-card">
        <div className="m-card-header-flex">
          <h3>Cuentas conectadas</h3>
          <span className="active-accounts-count">{activeAccountsList.length} activas</span>
        </div>

        <div className="accounts-list">
          {accounts.map((acc) => (
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
                  <strong>{acc.name}</strong>
                  <small>{acc.connected ? acc.handle : 'Clic para conectar'}</small>
                </div>
              </div>
              <div className="acc-action-right">
                {!acc.connected ? (
                  <button type="button" className="btn-connect-sm" onClick={(e) => { e.stopPropagation(); openConnectModal(acc); }}>
                    <Link2 size={12} /> Conectar
                  </button>
                ) : (
                  <div className={`acc-checkbox ${acc.active ? 'checked' : ''}`}>
                    {acc.active && <Check size={12} />}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DE CONEXIÓN OAUTH DE REDES SOCIALES */}
      {connectModalAcc && (
        <div className="modal-overlay-marketing" onClick={() => setConnectModalAcc(null)}>
          <div className="modal-box-marketing" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-marketing">
              <div className="modal-title-flex">
                <div className="acc-icon-badge-lg" style={{ backgroundColor: connectModalAcc.color + '20', color: connectModalAcc.color }}>
                  {connectModalAcc.name.charAt(0)}
                </div>
                <div>
                  <h4>Conectar {connectModalAcc.name}</h4>
                  <p>Vincular la cuenta oficial de tu negocio para publicar con 1 clic</p>
                </div>
              </div>
              <button className="btn-close-modal" onClick={() => setConnectModalAcc(null)}><X size={18} /></button>
            </div>

            <div className="modal-body-marketing">
              <div className="oauth-method-box">
                <ShieldCheck size={20} className="text-teal" />
                <div>
                  <strong>Conexión Oficial Segura OAuth 2.0</strong>
                  <small>No almacenamos contraseñas. Autorización directa con {connectModalAcc.name}.</small>
                </div>
              </div>

              <button
                type="button"
                className="btn-oauth-official"
                style={{ backgroundColor: connectModalAcc.color }}
                onClick={() => {
                  alert(`Redirigiendo a la pantalla de autorización oficial de ${connectModalAcc.name} (Meta / OAuth App)...`)
                  if (onConnectAccount) {
                    onConnectAccount({
                      plataforma: connectModalAcc.id,
                      nombreCuenta: connectModalAcc.name,
                      handle: `@${business?.nombre?.toLowerCase()?.replace(/\s+/g, '') || 'mitienda'}`,
                      estado: 'conectado'
                    })
                  }
                  setConnectModalAcc(null)
                }}
              >
                <ExternalLink size={15} /> Iniciar sesión y autorizar en {connectModalAcc.name}
              </button>

              <div className="divider-or"><span>O vincular usuario manualmente</span></div>

              <form onSubmit={handleSaveConnection} className="manual-handle-form">
                <label>Nombre de usuario / Handle (@)</label>
                <input
                  type="text"
                  placeholder={`Ej: @${connectModalAcc.name.toLowerCase()}_tienda`}
                  value={handleInput}
                  onChange={(e) => setHandleInput(e.target.value)}
                  required
                />
                <button type="submit" className="btn-save-handle" disabled={connecting}>
                  {connecting ? 'Guardando...' : 'Vincular Cuenta del Negocio'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


