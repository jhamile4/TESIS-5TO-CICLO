import { Sparkles, ImagePlus, WandSparkles, Check } from 'lucide-react'

export default function MarketingEditorCol({
  templates,
  tipo,
  setTipo,
  prompt,
  setPrompt,
  uploadedImage,
  handleImageUpload,
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

        <div className="prompt-area-wrap">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe tu producto, campaña o idea para que la IA genere el contenido perfecto..."
            maxLength={500}
          />
          <span className="prompt-counter">{prompt.length}/500</span>
        </div>

        <label className="image-upload-dashed">
          <ImagePlus size={16} />
          <span>{uploadedImage ? 'Cambiar imagen subida' : 'Subir imagen propia (opcional)'}</span>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </label>

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
          className={`generate-cta-btn ${contentType === 'Video' ? 'video-mode' : ''}`}
          disabled={loading}
          onClick={generate}
        >
          <WandSparkles size={16} />
          {loading ? 'Generando...' : contentType === 'Video' ? 'Generar Guión + Video' : 'Generar con IA'}
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
