import { useRef, useState } from 'react'
import { ImagePlus, Sparkles } from 'lucide-react'
import MetaAccountsCard from './MetaAccountsCard'
import './marketing.css'

// El "id" es lo que recibe la IA; el "label" es lo que ve el dueño.
// "idea" arma la indicación para la IA con un producto real del negocio (o uno de ejemplo)
const tiposPublicacion = [
  { id: 'Promoción / Oferta', label: 'Oferta',
    idea: (p) => `Oferta especial de "${p.nombre}"${p.precio ? ` a S/ ${p.precio}` : ''}, solo por esta semana. Invitar a pedirlo por WhatsApp.` },
  { id: 'Nuevo Producto', label: 'Producto nuevo',
    idea: (p) => `Presentar "${p.nombre}" como novedad${p.precio ? ` a S/ ${p.precio}` : ''}. Contar qué lo hace especial e invitar a pedirlo.` },
  { id: 'Testimonial', label: 'Opinión de cliente',
    idea: (p) => `Un cliente quedó feliz con "${p.nombre}". Contar su experiencia de forma breve y cálida e invitar a probarlo.` },
  { id: 'Tip / Educativo', label: 'Consejo',
    idea: (p) => `Un consejo útil para aprovechar mejor "${p.nombre}", y recordar que lo tenemos en la tienda.` },
  { id: 'Detrás de Cámaras', label: 'Detrás de cámaras',
    idea: (p) => `Mostrar cómo preparamos o elegimos "${p.nombre}" con cuidado en nuestro negocio.` },
  { id: 'Viral / Trending', label: 'Tendencia',
    idea: (p) => `"${p.nombre}" es lo más pedido de la semana. Generar urgencia: quedan pocas unidades.` }
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
  onDisconnect,
  productos = []
}) {
  const [productoElegido, setProductoElegido] = useState(null)
  // Última idea que puso CRECIO: si el dueño no la cambió, se puede reemplazar al cambiar de tipo
  const ideaAutomatica = useRef('')

  const tipoActual = tiposPublicacion.find((t) => t.id === tipo) || tiposPublicacion[0]
  const tonoActual = tonos.find((t) => t.id === tono) || tonos[0]
  const esVideo = contentType === 'Video'

  // Sugerencia con el producto elegido, o con el primero del catálogo como ejemplo
  const productoEjemplo = productoElegido || productos[0] || { nombre: 'tu producto más vendido' }
  const sugerencia = tipoActual.idea(productoEjemplo)

  const ponerIdea = (texto) => {
    ideaAutomatica.current = texto
    setPrompt(texto)
  }

  const elegirTipo = (nuevoTipo) => {
    setTipo(nuevoTipo.id)
    // Solo se reemplaza lo que escribió CRECIO; lo que escribió el dueño no se toca
    if (prompt && prompt === ideaAutomatica.current) ponerIdea(nuevoTipo.idea(productoEjemplo))
  }

  const elegirProducto = (e) => {
    const producto = productos.find((p) => String(p.id || p.pk_id) === e.target.value) || null
    setProductoElegido(producto)
    if (!producto) return
    // Es una instrucción para la IA (no el texto final): la IA redacta la publicación
    if (!prompt || prompt === ideaAutomatica.current) ponerIdea(tipoActual.idea(producto))
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
              <button key={t.id} type="button" className={`mk-chip ${tipo === t.id ? 'is-active' : ''}`} onClick={() => elegirTipo(t)}>
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
            placeholder={`Ej: ${sugerencia}`}
            maxLength={500}
          />
          <div className="mk-idea-row">
            <p className="mk-hint">Es una indicación para la IA; el texto final aparece en la vista previa y puedes editarlo.</p>
            {prompt !== sugerencia && (
              <button type="button" className="mk-link" onClick={() => ponerIdea(sugerencia)}>
                {prompt ? 'Cambiar por la sugerencia' : 'Usar esta sugerencia'}
              </button>
            )}
          </div>
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
          onDisconnect={onDisconnect}
        />
      </div>
    </div>
  )
}
