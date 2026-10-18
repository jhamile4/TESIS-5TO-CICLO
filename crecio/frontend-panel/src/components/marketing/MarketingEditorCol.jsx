import { useState } from 'react'
import {
  Tag,
  ShoppingBag,
  Heart,
  Bookmark,
  Film,
  Flame,
  Sparkles,
  ImagePlus,
  WandSparkles,
  Check,
  X,
  Pencil
} from 'lucide-react'
import {
  InstagramIcon,
  FacebookIcon,
  WhatsAppIcon,
  TwitterIcon,
  YoutubeIcon,
  TikTokIcon
} from '../common/SocialIcons'

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
  activeAccountsList,
  toggleAccount,
  onConnectAccount,
  business,
  productos = []
}) {
  const [connectModalAcc, setConnectModalAcc] = useState(null)
  const [handleInput, setHandleInput] = useState('')
  const [connecting, setConnecting] = useState(false)

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

  const getSocialIcon = (id) => {
    switch (id) {
      case 'instagram': return <InstagramIcon size={18} />
      case 'tiktok': return <TikTokIcon size={18} />
      case 'facebook': return <FacebookIcon size={18} />
      case 'youtube': return <YoutubeIcon size={18} />
      case 'twitter': return <TwitterIcon size={18} />
      case 'whatsapp': return <WhatsAppIcon size={18} />
      default: return <Sparkles size={18} />
    }
  }

  const getSocialBadgeColor = (id) => {
    switch (id) {
      case 'instagram': return { bg: '#fdf2f8', color: '#db2777', border: '#fbcfe8' }
      case 'tiktok': return { bg: '#0f172a', color: '#ffffff', border: '#0f172a' }
      case 'facebook': return { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' }
      case 'youtube': return { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' }
      case 'twitter': return { bg: '#f8fafc', color: '#0f172a', border: '#e2e8f0' }
      case 'whatsapp': return { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' }
      default: return { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' }
    }
  }

  return (
    <div className="marketing-col-left">
      {/* Plantilla de contenido */}
      <div className="m-card">
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: '0 0 14px' }}>
          Plantilla de contenido
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
            Prompt de IA
          </h3>
        </div>

        {productos && productos.length > 0 && (
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>
              🛍️ O selecciona un producto de tu catálogo para promocionar:
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
                  setPrompt(`¡Gran oportunidad! Promoción especial de ${selectedProd.nombre}: ${selectedProd.descripcion || 'calidad garantizada'}. Precio regular: S/${selectedProd.precio}. ¡Pide el tuyo por WhatsApp antes que se agote!`)
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
            placeholder="Describe tu producto, campaña o idea para que la IA genere el contenido perfecto..."
            maxLength={500}
          />
          <span className="prompt-counter">{prompt.length}/500</span>
        </div>

        <div style={{ marginTop: '14px' }}>
          <label style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>
            Imagen del post (opcional)
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
            ? 'Generar Guión + Video'
            : 'Generar Publicación con IA'}
        </button>

        {error && <p className="m-error-msg">{error}</p>}
      </div>

      {/* Cuentas conectadas */}
      <div className="m-card">
        <div className="m-card-header-flex">
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
            Cuentas conectadas
          </h3>
          <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>
            {activeAccountsList.length} activas
          </span>
        </div>

        <div className="accounts-list">
          {accounts.map((acc) => {
            const badgeStyle = getSocialBadgeColor(acc.id)
            const isConfigured = acc.handle && acc.handle !== 'Sin conectar'
            return (
              <div
                key={acc.id}
                className="account-item-figma"
                onClick={() => {
                  if (!isConfigured) {
                    openConnectModal(acc)
                  } else {
                    toggleAccount(acc.id)
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: badgeStyle.bg,
                      color: badgeStyle.color,
                      border: `1px solid ${badgeStyle.border}`,
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0
                    }}
                  >
                    {getSocialIcon(acc.id)}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <strong style={{ display: 'block', fontSize: '13px', color: '#0f172a', fontWeight: 700 }}>
                      {acc.name}
                    </strong>
                    <small
                      style={{
                        display: 'block',
                        fontSize: '11px',
                        color: isConfigured ? '#64748b' : '#94a3b8',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {isConfigured ? acc.handle : 'Sin vincular (Clic para agregar)'}
                    </small>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      openConnectModal(acc)
                    }}
                    title="Editar usuario o enlace de tu negocio"
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      color: '#475569',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontWeight: 600,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Pencil size={11} />
                    <span>{isConfigured ? 'Editar' : 'Vincular'}</span>
                  </button>

                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleAccount(acc.id)
                    }}
                    title={acc.active ? 'Activa para publicar (clic para desactivar)' : 'Desactivada (clic para activar)'}
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: acc.active ? '#0f172a' : 'transparent',
                      border: acc.active ? 'none' : '1.5px solid #cbd5e1',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {acc.active && <Check size={11} strokeWidth={3.5} />}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: '12px', padding: '8px 10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9', fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>💡</span>
          <span>También puedes configurar tus redes desde <strong>Configuración &gt; Datos del Negocio</strong>.</span>
        </div>
      </div>

      {/* MODAL PARA CONECTAR / EDITAR CUENTA */}
      {connectModalAcc && (
        <div className="modal-overlay-marketing" onClick={() => setConnectModalAcc(null)}>
          <div className="modal-box-marketing" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-marketing">
              <div className="modal-title-flex">
                <div className="acc-icon-badge-lg" style={{ backgroundColor: connectModalAcc.color + '20', color: connectModalAcc.color }}>
                  {getSocialIcon(connectModalAcc.id)}
                </div>
                <div>
                  <h4>Vincular {connectModalAcc.name}</h4>
                  <p>Ingresa el usuario o enlace de tu tienda</p>
                </div>
              </div>
              <button className="btn-close-modal" onClick={() => setConnectModalAcc(null)}><X size={18} /></button>
            </div>

            <div className="modal-body-marketing">
              <form onSubmit={handleSaveConnection} className="manual-handle-form">
                <label>
                  {connectModalAcc.id === 'whatsapp'
                    ? 'Número de WhatsApp de tu negocio'
                    : connectModalAcc.id === 'facebook'
                    ? 'Página o usuario de Facebook'
                    : `Usuario o enlace de ${connectModalAcc.name}`}
                </label>
                <input
                  type="text"
                  placeholder={
                    connectModalAcc.id === 'whatsapp'
                      ? 'Ej: 987 654 321'
                      : connectModalAcc.id === 'facebook'
                      ? 'Ej: facebook.com/mitienda o MiTiendaPeru'
                      : connectModalAcc.id === 'instagram'
                      ? 'Ej: @mitiendaperu'
                      : connectModalAcc.id === 'tiktok'
                      ? 'Ej: @mitienda_tiktok'
                      : `@${connectModalAcc.name.toLowerCase()}_tienda`
                  }
                  value={handleInput}
                  onChange={(e) => setHandleInput(e.target.value)}
                  autoFocus
                  required
                />
                <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                  <button
                    type="button"
                    onClick={() => setConnectModalAcc(null)}
                    style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: '#475569' }}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-save-handle" style={{ flex: 2 }} disabled={connecting}>
                    {connecting ? 'Guardando...' : 'Guardar y Activar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
