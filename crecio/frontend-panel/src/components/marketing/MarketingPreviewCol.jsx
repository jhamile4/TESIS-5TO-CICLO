import { useState } from 'react'
import { Video as VideoIcon, Play, Copy, Check, RotateCw, Send, CalendarDays, Clock, Film, Music, Sparkles } from 'lucide-react'
import { InstagramIcon, FacebookIcon } from '../common/SocialIcons'

export default function MarketingPreviewCol({
  contentTypes,
  contentType,
  setContentType,
  business,
  uploadedImage,
  content,
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
  const [viewTab, setViewTab] = useState('post') // 'post' o 'guion'
  const isVideo = contentType === 'Video' || contentType === 'Reels / Short'
  const isStory = contentType === 'Story'

  return (
    <div className="marketing-col-right">
      {/* Vista Previa del Post */}
      <div className="m-card">
        <div className="preview-top-header">
          <h3>Vista Previa del Contenido</h3>
          <div className="social-icons-preview">
            <InstagramIcon size={14} className="icon-ig" />
            <FacebookIcon size={14} className="icon-fb" />
          </div>
        </div>

        <div className="content-type-label">Tipo de contenido</div>
        <div className="content-types-scroll">
          {contentTypes.map((ct) => (
            <button
              key={ct.id}
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
              className={`subtab-btn ${viewTab === 'post' ? 'active' : ''}`}
              onClick={() => setViewTab('post')}
            >
              <Film size={13} /> Vista previa Reel
            </button>
            <button
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
                <img src={uploadedImage} alt="Post media" className="mockup-img" />
              ) : isVideo ? (
                <div className="mockup-video-placeholder">
                  <div className="video-tag-badge">
                    <VideoIcon size={12} /> REEL / SHORT GENERADO POR IA
                  </div>
                  <div className="play-button-overlay">
                    <div className="audio-wave-pulse"></div>
                    <Play size={26} fill="#fff" />
                    <span>Reproducir Reel · 0:30</span>
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
              <p className="editable-caption">
                {content || (
                  isVideo
                    ? '📹 Reel generado por IA listo para publicar. #reels #viral'
                    : '🎉 ¡OFERTA ESPECIAL! 20% OFF en todos nuestros productos. ¡Compra ahora!'
                )}
              </p>
              <small className="edit-hint">Contenido 100% generado y editable</small>
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
          <button className="copy-text-btn" onClick={copyText}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Texto copiado' : 'Copiar texto completo'}
          </button>
          <button className="refresh-btn" onClick={generate} title="Regenerar con IA">
            <RotateCw size={15} />
          </button>
        </div>
      </div>

      {/* ¿Cuándo publicar? */}
      <div className="m-card">
        <h3>¿Cuándo publicar en Redes Sociales?</h3>

        <div className="publish-mode-toggle">
          <button
            className={publishMode === 'ahora' ? 'active' : ''}
            onClick={() => setPublishMode('ahora')}
          >
            <Send size={14} /> Publicar ahora
          </button>
          <button
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
                  onChange={(e) => setScheduleDate(e.target.value)}
                />
              </div>
              <div>
                <label>Hora</label>
                <select value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)}>
                  <option value="">Seleccionar hora</option>
                  <option value="09:00">09:00 AM (Recomendado)</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="18:00">06:00 PM (Recomendado)</option>
                  <option value="21:00">09:00 PM</option>
                </select>
              </div>
            </div>
            <small className="recommendation-text">
              <Clock size={12} /> Horarios de máxima interacción según tus redes conectadas.
            </small>
          </div>
        )}

        <div className="target-platforms-row">
          <span>Se enviará a:</span>
          {activeAccountsList.length > 0 ? (
            activeAccountsList.map((acc) => (
              <span key={acc.id} className="platform-pill-badge">
                {acc.name}
              </span>
            ))
          ) : (
            <small className="no-platforms-warn">Selecciona al menos una red</small>
          )}
        </div>

        <button
          className="main-publish-cta-btn"
          disabled={activeAccountsList.length === 0 || publishing}
          onClick={handlePublishOrSchedule}
        >
          {publishing ? (
            'Procesando con la API...'
          ) : publishMode === 'ahora' ? (
            <>
              <Send size={16} /> Publicar Ahora Directamente
            </>
          ) : (
            <>
              <CalendarDays size={16} /> Programar Publicación Automática
            </>
          )}
        </button>
      </div>
    </div>
  )
}

