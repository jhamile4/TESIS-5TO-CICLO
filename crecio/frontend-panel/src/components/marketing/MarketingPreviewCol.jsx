import { Video as VideoIcon, Play, Copy, Check, RotateCw, Send, CalendarDays, Clock } from 'lucide-react'
import { InstagramIcon, FacebookIcon } from '../common/SocialIcons'

export default function MarketingPreviewCol({
  contentTypes,
  contentType,
  setContentType,
  business,
  uploadedImage,
  content,
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
  handlePublishOrSchedule
}) {
  return (
    <div className="marketing-col-right">
      {/* Vista Previa del Post */}
      <div className="m-card">
        <div className="preview-top-header">
          <h3>Vista Previa del Post</h3>
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

        {/* Real Post Card Simulation */}
        <div className="post-mockup-card">
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
            ) : contentType === 'Video' ? (
              <div className="mockup-video-placeholder">
                <div className="video-tag-badge">
                  <VideoIcon size={12} /> VIDEO
                </div>
                <div className="play-button-overlay">
                  <Play size={24} fill="#fff" />
                  <span>Video · 0:60</span>
                </div>
              </div>
            ) : (
              <div className="mockup-default-graphic">
                <div className="flash-sale-banner">
                  <span className="star-decoration">★</span>
                  <h2>FLASH SALE</h2>
                  <span className="percent-badge">%</span>
                </div>
              </div>
            )}
          </div>

          <div className="mockup-caption-area">
            <p className="editable-caption">
              {content || (
                contentType === 'Video'
                  ? '📹 Mira cómo nuestro producto transforma tu día a día. ¡Dale play! Guión generado por IA. #video #viral'
                  : '🎉 ¡OFERTA ESPECIAL! 20% OFF en todos nuestros productos. ¡Compra ahora! #Descuento #Venta #negocio #emprendimiento #calidad'
              )}
            </p>
            <small className="edit-hint">Clic en el texto para editar</small>
          </div>
        </div>

        {/* Action buttons below mockup */}
        <div className="post-actions-row">
          <button className="copy-text-btn" onClick={copyText}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Texto copiado' : 'Copiar texto'}
          </button>
          <button className="refresh-btn" onClick={generate} title="Regenerar con IA">
            <RotateCw size={15} />
          </button>
        </div>
      </div>

      {/* ¿Cuándo publicar? */}
      <div className="m-card">
        <h3>¿Cuándo publicar?</h3>

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
              <Clock size={12} /> Horarios recomendados basados en tus plataformas seleccionadas.
            </small>
          </div>
        )}

        <div className="target-platforms-row">
          <span>Se publicará en:</span>
          {activeAccountsList.length > 0 ? (
            activeAccountsList.map((acc) => (
              <span key={acc.id} className="platform-pill-badge">
                {acc.name}
              </span>
            ))
          ) : (
            <small className="no-platforms-warn">Ninguna red seleccionada</small>
          )}
        </div>

        <button
          className="main-publish-cta-btn"
          disabled={activeAccountsList.length === 0}
          onClick={handlePublishOrSchedule}
        >
          {publishMode === 'ahora' ? (
            <>
              <Send size={16} /> Publicar Ahora
            </>
          ) : (
            <>
              <CalendarDays size={16} /> Programar Publicación
            </>
          )}
        </button>
      </div>
    </div>
  )
}
