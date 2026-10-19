import { ImagePlus, Sparkles } from 'lucide-react'
import MetaAccountsCard from './MetaAccountsCard'
import './marketing.css'

// El "id" es lo que recibe la IA; el "label" es lo que ve el dueño
const tiposPublicacion = [
  { id: 'Promoción / Oferta', label: 'Oferta', ejemplo: 'Ej: 2x1 en ramos de rosas este fin de semana' },
  { id: 'Nuevo Producto', label: 'Producto nuevo', ejemplo: 'Ej: llegaron las macetas de cerámica pintadas a mano' },
  { id: 'Testimonial', label: 'Opinión de cliente', ejemplo: 'Ej: una clienta nos agradeció por el arreglo de su boda' },
  { id: 'Tip / Educativo', label: 'Consejo', ejemplo: 'Ej: cómo hacer que tus flores duren más días en casa' },
  { id: 'Detrás de Cámaras', label: 'Detrás de cámaras', ejemplo: 'Ej: así preparamos los arreglos cada mañana' },
  { id: 'Viral / Trending', label: 'Tendencia', ejemplo: 'Ej: el ramo más pedido de la semana' }
]

const tonos = [
  { id: 'Modo Creativo', label: 'Cercano', ayuda: 'Amigable, con algunos emojis.' },
  { id: 'Modo Profesional', label: 'Profesional', ayuda: 'Formal y enfocado en confianza y calidad.' },
  { id: 'Formato Corto', label: 'Breve', ayuda: 'Dos o tres líneas, ideal para historias.' },
  { id: 'Viral / Trending', label: 'Persuasivo', ayuda: 'Con urgencia y una invitación clara a comprar.' }
]

export default function MarketingEditorCol({
  tipo,
  setTipo,
  prompt,
  setPrompt,
  uploadedImage,
  setUploadedImage,
  handleImageUpload,
  generateImageIa,
  loadingImage,
  tono,
  setTono,
  contentType,
  loading,
  error,
  generate,
  accounts,
  toggleAccount,
  onStartMetaAuth,
  onManualTokenConnect,
  onDisconnect,
  productos = []
}) {
  const tipoActual = tiposPublicacion.find((t) => t.id === tipo) || tiposPublicacion[0]
  const tonoActual = tonos.find((t) => t.id === tono) || tonos[0]
  const esVideo = contentType === 'Video'

  const elegirProducto = (e) => {
    const producto = productos.find((p) => String(p.id || p.pk_id) === e.target.value)
    if (!producto) return
    // Es una instrucción para la IA (no el texto final): la IA redacta la publicación
    setPrompt(`Promocionar "${producto.nombre}" a S/ ${producto.precio}.${producto.descripcion ? ` ${producto.descripcion}.` : ''} Invitar a pedirlo por WhatsApp.`)
    if (producto.imagen_url) setUploadedImage(producto.imagen_url)
  }

  return (
    <div className="marketing-col-left">
      <div className="mk-card">
        <div className="mk-card-head">
          <div>
            <h3>Crear publicación</h3>
            <p>Cuéntale a la IA qué quieres comunicar y ella redacta el texto.</p>
          </div>
        </div>

        <div className="mk-section">
          <span className="mk-label">Tipo de publicación</span>
          <div className="mk-chips">
            {tiposPublicacion.map((t) => (
              <button key={t.id} type="button" className={`mk-chip ${tipo === t.id ? 'is-active' : ''}`} onClick={() => setTipo(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mk-section">
          <span className="mk-label">¿Qué quieres publicar?</span>
          {productos.length > 0 && (
            <select className="mk-select" onChange={elegirProducto} defaultValue="">
              <option value="">Usar un producto de mi catálogo (opcional)</option>
              {productos.map((p) => (
                <option key={p.id || p.pk_id} value={p.id || p.pk_id}>
                  {p.nombre} — S/ {p.precio}
                </option>
              ))}
            </select>
          )}
          <textarea
            className="mk-textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={tipoActual.ejemplo}
            maxLength={500}
          />
          <p className="mk-hint">Es una indicación para la IA; el texto final aparece en la vista previa y puedes editarlo.</p>
        </div>

        <div className="mk-section">
          <span className="mk-label">Tono</span>
          <div className="mk-segmented">
            {tonos.map((t) => (
              <button key={t.id} type="button" className={tono === t.id ? 'is-active' : ''} onClick={() => setTono(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
          <p className="mk-hint">{tonoActual.ayuda}</p>
        </div>

        <div className="mk-section">
          <span className="mk-label">Imagen <span style={{ fontWeight: 400, color: '#94a3b8' }}>· obligatoria para Instagram</span></span>
          <div className="mk-btn-row">
            <label className="mk-btn" style={{ cursor: 'pointer' }}>
              <ImagePlus size={15} /> {uploadedImage ? 'Cambiar foto' : 'Subir foto'}
              <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
            </label>
            <button type="button" className="mk-btn" onClick={generateImageIa} disabled={loadingImage}>
              <Sparkles size={15} /> {loadingImage ? 'Creando imagen…' : 'Crear con IA'}
            </button>
          </div>
          {uploadedImage && (
            <div className="mk-image-chosen">
              <img src={uploadedImage} alt="" />
              <span>Imagen lista</span>
              <button type="button" className="mk-link-danger" onClick={() => setUploadedImage(null)}>Quitar</button>
            </div>
          )}
        </div>

        <button type="button" className="mk-btn mk-btn-primary mk-btn-block" disabled={loading} onClick={generate}>
          <Sparkles size={15} />
          {loading ? 'Redactando…' : esVideo ? 'Escribir guion con IA' : 'Redactar con IA'}
        </button>
        {error && <p className="mk-error">{error}</p>}
      </div>

      <div style={{ marginTop: '16px' }}>
        <MetaAccountsCard
          accounts={accounts}
          toggleAccount={toggleAccount}
          onStartMetaAuth={onStartMetaAuth}
          onManualTokenConnect={onManualTokenConnect}
          onDisconnect={onDisconnect}
        />
      </div>
    </div>
  )
}
