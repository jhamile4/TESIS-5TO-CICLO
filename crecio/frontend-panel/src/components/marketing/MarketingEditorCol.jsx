import MetaAccountsCard from './MetaAccountsCard'
import {
  Tag,
  ShoppingBag,
  Heart,
  Bookmark,
  Film,
  Flame,
  Sparkles,
  ImagePlus,
  WandSparkles
} from 'lucide-react'

const templateItems = [
  { id: 'Promoción / Oferta', label: 'Promoción / Oferta', icon: Tag },
  { id: 'Nuevo Producto', label: 'Nuevo Producto', icon: ShoppingBag },
  { id: 'Testimonial', label: 'Testimonial', icon: Heart },
  { id: 'Tip / Educativo', label: 'Tip / Educativo', icon: Bookmark },
  { id: 'Detrás de Cámaras', label: 'Detrás de Cámaras', icon: Film },
  { id: 'Viral / Trending', label: 'Viral / Trending', icon: Flame }
]

const templatePrompts = {
  'Promoción / Oferta': 'Gran liquidación: 20% de descuento en productos seleccionados solo por este fin de semana. ¡Aprovecha antes que se agoten!',
  'Nuevo Producto': '¡Lanzamiento oficial! Conoce nuestro nuevo producto estrella, calidad garantizada y envíos a todo el Perú.',
  'Testimonial': 'Un cliente feliz nos cuenta: "La atención y la calidad fueron de 10 puntos, llegó súper rápido". ¡Gracias por confiar en nosotros!',
  'Tip / Educativo': '3 tips prácticos que debes conocer para cuidar tus productos y aprovecharlos al máximo todos los días.',
  'Detrás de Cámaras': 'Comparte un momento detrás de cámaras de tu negocio para humanizar tu marca y mostrar cómo preparamos cada pedido.',
  'Viral / Trending': '¡El producto más pedido de la semana que todos están buscando en redes! No te quedes sin el tuyo.'
}

const toneDescriptions = {
  'Modo Creativo': '🎨 Estilo fresco, entretenido y con emojis llamativos para conectar con tu audiencia.',
  'Modo Profesional': '💼 Lenguaje formal, elegante y enfocado en confianza, calidad y seriedad.',
  'Formato Corto': '⚡ Textos directos y al grano, ideales para lecturas rápidas o Stories.',
  'Viral / Trending': '🔥 Enfocado en tendencias populares, llamados a la acción y urgencia de compra.'
}

export default function MarketingEditorCol({
  templates,
  tipo,
  setTipo,
  prompt,
  setPrompt,
  uploadedImage,
  setUploadedImage,
  handleImageUpload,
  generateImageIa,
  loadingImage,
  tones,
  tono,
  setTono,
  contentType,
  setContentType,
  loading,
  error,
  generate,
  accounts,
  toggleAccount,
  onStartMetaAuth,
  onManualTokenConnect,
  onDisconnect,
  business,
  productos = []
}) {

  const handleSelectTemplate = (templateId) => {
    setTipo(templateId)
    // Prellenar dinámicamente el prompt para que el botón sea 100% funcional
    if (templatePrompts[templateId]) {
      setPrompt(templatePrompts[templateId])
    }
    // Si es Detrás de Cámaras o Viral, sugerir formato Video
    if (templateId === 'Detrás de Cámaras' && setContentType) {
      setContentType('Video')
    } else if (templateId === 'Promoción / Oferta' && setContentType) {
      setContentType('Publicación')
    }
  }

  return (
    <div className="marketing-col-left">
      {/* Plantilla de contenido */}
      <div className="m-card">
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: '0 0 14px' }}>
          1. Tipo de publicación
        </h3>
        <div className="template-button-grid">
          {templateItems.map((item) => {
            const Icon = item.icon
            const isSelected = tipo === item.id
            return (
              <button
                key={item.id}
                type="button"
                className={`template-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelectTemplate(item.id)}
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Prompt de IA */}
      <div className="m-card">
        <div className="m-card-title">
          <Sparkles size={16} className="text-teal" />
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            2. ¿Qué quieres publicar?
          </h3>
        </div>

        {productos && productos.length > 0 && (
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>
              🛍️ Elige un producto de tu catálogo (opcional), o escribe tu idea abajo:
            </label>
            <select
              style={{
                width: '100%',
                padding: '7px 10px',
                fontSize: '12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                color: '#1e293b'
              }}
              onChange={(e) => {
                const prodId = e.target.value
                if (!prodId) return
                const selectedProd = productos.find(p => String(p.id || p.pk_id) === String(prodId))
                if (selectedProd) {
                  // Es una instrucción para la IA (no el texto final): la IA redacta la publicación
                  setPrompt(`Promocionar "${selectedProd.nombre}" a S/ ${selectedProd.precio}.${selectedProd.descripcion ? ` ${selectedProd.descripcion}.` : ''} Invitar a pedirlo por WhatsApp.`)
                  if (selectedProd.imagen_url && setUploadedImage) {
                    setUploadedImage(selectedProd.imagen_url)
                  }
                }
              }}
              defaultValue=""
            >
              <option value="">-- Elige un producto de tu catálogo --</option>
              {productos.map((p) => (
                <option key={p.id || p.pk_id} value={p.id || p.pk_id}>
                  {p.nombre} — S/ {p.precio}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="prompt-area-wrap">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Escribe una idea corta. Ej: oferta 2x1 en ramos de rosas por San Valentín, solo este fin de semana"
            maxLength={500}
          />
          <span className="prompt-counter">{prompt.length}/500</span>
        </div>
        <p style={{ margin: '6px 0 0', fontSize: '11px', color: '#64748b' }}>
          Esto es una instrucción para la IA, no se publica tal cual. Al presionar "Generar" la IA redacta el texto final a la derecha, y ahí lo puedes editar.
        </p>

        <div style={{ marginTop: '14px' }}>
          <label style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>
            3. Imagen (obligatoria para Instagram)
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <label className="image-upload-dashed" style={{ margin: 0, padding: '10px 8px' }}>
              <ImagePlus size={15} />
              <span>{uploadedImage ? 'Cambiar foto' : 'Subir mi foto'}</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </label>
            {generateImageIa && (
              <button
                type="button"
                className="image-upload-dashed"
                style={{
                  margin: 0,
                  padding: '10px 8px',
                  background: '#f0fdf4',
                  borderColor: '#86efac',
                  color: '#16a34a',
                  cursor: loadingImage ? 'wait' : 'pointer'
                }}
                disabled={loadingImage}
                onClick={generateImageIa}
                title="Generar imagen hiperrealista con IA a partir de tu prompt"
              >
                <Sparkles size={15} />
                <span>{loadingImage ? 'Generando...' : 'Generar foto IA'}</span>
              </button>
            )}
          </div>
          {uploadedImage && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', padding: '4px 8px', background: '#f8fafc', borderRadius: '6px' }}>
              <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>✓ Imagen lista para el post</span>
              {setUploadedImage && (
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer', padding: 0 }}
                  onClick={() => setUploadedImage(null)}
                >
                  Quitar foto
                </button>
              )}
            </div>
          )}
        </div>

        <label style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 600, margin: '14px 0 6px' }}>
          4. Estilo del texto
        </label>
        <div className="tone-pills-row">
          {tones.map((item) => (
            <button
              key={item}
              type="button"
              className={`tone-btn ${tono === item ? 'selected' : ''}`}
              onClick={() => setTono(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div style={{ marginTop: '8px', padding: '7px 10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9', fontSize: '11px', color: '#475569', lineHeight: 1.4 }}>
          {toneDescriptions[tono] || 'Selecciona un estilo para que la IA adapte el tono de la publicación.'}
        </div>

        <button
          type="button"
          className="generate-cta-btn video-mode"
          disabled={loading}
          onClick={generate}
          style={{ background: '#e1144b', marginTop: '14px' }}
        >
          <WandSparkles size={16} />
          {loading
            ? 'Generando con IA...'
            : contentType === 'Video' || contentType === 'Reels / Short'
            ? 'Generar guion con IA'
            : 'Generar Publicación con IA'}
        </button>

        {error && <p className="m-error-msg">{error}</p>}
      </div>

      <MetaAccountsCard
        accounts={accounts}
        toggleAccount={toggleAccount}
        onStartMetaAuth={onStartMetaAuth}
        onManualTokenConnect={onManualTokenConnect}
        onDisconnect={onDisconnect}
      />
    </div>
  )
}
