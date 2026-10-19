import { useState } from 'react'
import { Video as VideoIcon, Play, Copy, Check, RotateCw, Send, CalendarDays, Clock, Film, Music, Sparkles } from 'lucide-react'
import { InstagramIcon, FacebookIcon, WhatsAppIcon, TikTokIcon } from '../common/SocialIcons'

const getPlatformPillStyle = (id) => {
  switch (id) {
    case 'instagram': return { bg: '#fdf2f8', color: '#db2777', border: '#fbcfe8' }
    case 'facebook': return { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' }
    case 'tiktok': return { bg: '#f1f5f9', color: '#0f172a', border: '#e2e8f0' }
    case 'whatsapp': return { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' }
    default: return { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' }
  }
}

export default function MarketingPreviewCol({
  contentTypes,
  contentType,
  setContentType,
  business,
  uploadedImage,
  content,
  setContent,
  guionVideo,
  copied,
  copyText,
  generate,
  publishMode,
  setPublishMode,
  scheduleDate,
  setScheduleDate,
  scheduleTime,
  setScheduleTime,
  activeAccountsList,
  handlePublishOrSchedule,
  publishing
}) {
  const [viewTab, setViewTab] = useState('post')
  const isVideo = contentType === 'Video' || contentType === 'Reels / Short'
  const isStory = contentType === 'Story'

  return (
    <div className="marketing-col-right">
      {/* Vista Previa del Post */}
      <div className="m-card">
        <div className="preview-top-header">
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
            Vista Previa del Post
          </h3>
          <div className="social-icons-preview">
            <div className="social-circle-icon ig"><InstagramIcon size={12} /></div>
            <div className="social-circle-icon fb"><FacebookIcon size={12} /></div>
            <div className="social-circle-icon tt"><TikTokIcon size={12} /></div>
            <div className="social-circle-icon wa"><WhatsAppIcon size={12} /></div>
          </div>
        </div>

        <div className="content-type-label">Formato de publicación</div>
        <div className="content-types-scroll">
          {contentTypes.map((ct) => (
            <button
              key={ct.id}
              type="button"
              className={`ct-pill ${contentType === ct.id ? 'selected' : ''}`}
              onClick={() => setContentType(ct.id)}
            >
              {ct.label}
            </button>
          ))}
        </div>

        {isVideo && (
          <div className="video-subtabs-row">
            <button
              type="button"
              className={`subtab-btn ${viewTab === 'post' ? 'active' : ''}`}
              onClick={() => setViewTab('post')}
            >
              <Film size={13} /> Vista previa Reel
            </button>
            <button
              type="button"
              className={`subtab-btn ${viewTab === 'guion' ? 'active' : ''}`}
              onClick={() => setViewTab('guion')}
            >
              <Sparkles size={13} /> Guión de Producción IA
            </button>
          </div>
        )}

        {/* MOCKUP VISUAL */}
        {viewTab === 'post' || !isVideo ? (
          <div className={`post-mockup-card ${isStory ? 'story-format-vertical' : ''}`}>
            <div className="mockup-header">
              <div className="mockup-avatar">
                {business?.logoUrl ? <img src={business.logoUrl} alt="Logo" /> : 'MT'}
              </div>
              <div>
                <strong>{business?.nombre || 'Mi Tienda Crecio'}</strong>
                <small>Patrocinado · Ahora</small>
              </div>
            </div>

            <div className="mockup-media-container">
              {uploadedImage ? (
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                  <img src={uploadedImage} alt="Post media" className="mockup-img" />
                  {isVideo && (
                    <>
                      <div className="video-tag-badge">
                        <VideoIcon size={12} /> VIDEO
                      </div>
                      <div className="play-button-overlay">
                        <div className="play-circle-frosted">
                          <Play size={24} fill="#fff" style={{ marginLeft: '3px' }} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
                          Video · 0:60
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ) : isVideo ? (
                <div className="mockup-default-graphic video-graphic-figma">
                  <div className="video-tag-badge">
                    <VideoIcon size={12} /> VIDEO
                  </div>
                  <div className="flash-sale-banner">
                    <span className="star-decoration">★</span>
                    <h2>FLASH<br />SALE</h2>
                    <span className="percent-badge">%</span>
                  </div>
                  <div className="play-button-overlay">
                    <div className="play-circle-frosted">
                      <Play size={24} fill="#fff" style={{ marginLeft: '3px' }} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
                      Video · 0:60
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mockup-default-graphic">
                  <div className="flash-sale-banner">
                    <span className="star-decoration">★</span>
                    <h2>PROMO IA</h2>
                    <span className="percent-badge">%</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mockup-caption-area">
              <textarea
                className="editable-caption-textarea"
                value={content}
                onChange={(e) => setContent?.(e.target.value)}
                placeholder="Aquí aparecerá tu publicación cuando presiones «Generar Publicación con IA». También puedes escribirla tú."
                rows={4}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                <small className="edit-hint">✎ Clic en el texto para editar</small>
                <small style={{ fontSize: '11px', color: '#94a3b8' }}>{content?.length || 0} caracteres</small>
              </div>
            </div>
          </div>
        ) : (
          /* VISTA DE GUIÓN DE PRODUCCIÓN DE VIDEO IA */
          <div className="guion-ia-container">
            <div className="guion-header-badge">
              <Film size={16} />
              <h4>Guión y Producción de Reel por IA</h4>
            </div>

            <div className="guion-step-card hook-step">
              <div className="step-time">0 - 3 Seg (Gancho de Impacto)</div>
              <p>{guionVideo?.gancho || '🔥 ¡Atención! Mira cómo este producto cambia por completo tu día a día.'}</p>
            </div>

            <div className="guion-step-card body-step">
              <div className="step-time">3 - 15 Seg (Demostración / Valor)</div>
              <p>{guionVideo?.desarrollo || 'Muestra de cerca los detalles, acabados y textura del producto en alta definición.'}</p>
            </div>

            <div className="guion-step-card cta-step">
              <div className="step-time">15 - 30 Seg (Cierre / Llamada a Acción)</div>
              <p>{guionVideo?.cta || '🛒 Haz clic en el enlace del perfil y obtén tu 20% OFF con envío gratis hoy.'}</p>
            </div>

            {guionVideo?.audio_sugerido && (
              <div className="guion-audio-badge">
                <Music size={14} />
                <span>Audio recomendado: <strong>{guionVideo.audio_sugerido}</strong></span>
              </div>
            )}
          </div>
        )}

        {/* Action buttons below mockup */}
        <div className="post-actions-row">
          <button type="button" className="copy-text-btn" onClick={copyText}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Texto copiado' : 'Copiar texto'}</span>
          </button>
          <button type="button" className="refresh-btn" onClick={generate} title="Regenerar con IA">
            <RotateCw size={15} />
          </button>
        </div>
      </div>

      {/* ¿Cuándo publicar? */}
      <div className="m-card">
        <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '0 0 14px' }}>
          ¿Cuándo publicar?
        </h3>

        <div className="publish-mode-toggle">
          <button
            type="button"
            className={publishMode === 'ahora' ? 'active' : ''}
            onClick={() => setPublishMode('ahora')}
          >
            <Send size={14} /> Publicar ahora
          </button>
          <button
            type="button"
            className={publishMode === 'programar' ? 'active' : ''}
            onClick={() => setPublishMode('programar')}
          >
            <CalendarDays size={14} /> Programar
          </button>
        </div>

        {publishMode === 'programar' && (
          <div className="schedule-picker-box">
            <div className="picker-inputs-row">
              <div>
                <label>Fecha</label>
                <input
                  type="date"
                  value={scheduleDate}
                  min={new Date().toLocaleDateString('en-CA')}
                  onChange={(e) => setScheduleDate(e.target.value)}
                />
              </div>
              <div>
                <label>Hora</label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                />
              </div>
            </div>
            <small className="recommendation-text">
              <Clock size={12} /> Hora de Perú. Sugerencia: 9:00 a. m. o 6:00 p. m. suelen tener más interacción.
            </small>
          </div>
        )}

        <div className="target-platforms-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', margin: '14px 0 16px' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Se publicará en:</span>
          {activeAccountsList.length > 0 ? (
            activeAccountsList.map((acc) => {
              const pillColor = getPlatformPillStyle(acc.id)
              return (
                <span
                  key={acc.id}
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '16px',
                    background: pillColor.bg,
                    color: pillColor.color,
                    border: `1px solid ${pillColor.border}`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {acc.name}
                </span>
              )
            })
          ) : (
            <small className="no-platforms-warn">Selecciona al menos una red</small>
          )}
        </div>
        {!content?.trim() && (
          <small className="no-platforms-warn" style={{ display: 'block', marginTop: '6px' }}>
            Primero genera (o escribe) el texto de la publicación
          </small>
        )}

        <button
          type="button"
          className="main-publish-cta-btn"
          disabled={activeAccountsList.length === 0 || publishing || !content?.trim()}
          onClick={handlePublishOrSchedule}
        >
          {publishing ? (
            'Publicando en tus redes...'
          ) : (
            <>
              <Send size={16} /> Publicar Ahora
            </>
          )}
        </button>
      </div>
    </div>
  )
}
