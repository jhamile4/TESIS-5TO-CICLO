import { Sparkles, ImagePlus, WandSparkles, Check, RefreshCw, Palette } from 'lucide-react'

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
  toggleAccount
}) {
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
              onClick={() => toggleAccount(acc.id)}
            >
              <div className="acc-info">
                <div className="acc-icon-badge" style={{ backgroundColor: acc.color + '15', color: acc.color }}>
                  {acc.name.charAt(0)}
                </div>
                <div>
                  <strong>{acc.name}</strong>
                  <small>{acc.handle}</small>
                </div>
              </div>
              <div className={`acc-checkbox ${acc.active ? 'checked' : ''}`}>
                {acc.active && <Check size={12} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

