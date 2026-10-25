import { Copy, Check, RotateCw, Send, CalendarDays, ImageIcon, Lock } from 'lucide-react'
import { pagarProUrl } from '../../config/env'
import './marketing.css'

const formatos = [
  { id: 'Publicación', label: 'Publicación' },
  { id: 'Story', label: 'Historia' },
  { id: 'Video', label: 'Guion de video' }
]

const pasosGuion = [
  ['gancho', 'Inicio (0–3 s): capta la atención'],
  ['desarrollo', 'Desarrollo (3–15 s): muestra el producto'],
  ['cta', 'Cierre: invitación a comprar'],
  ['audio_sugerido', 'Música sugerida']
]

export default function MarketingPreviewCol({
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
  loading,
  publishMode,
  setPublishMode,
  scheduleDate,
  setScheduleDate,
  scheduleTime,
  setScheduleTime,
  activeAccountsList,
  handlePublishOrSchedule,
  publishing,
  puedePublicar = true
}) {
  const esVideo = contentType === 'Video'
  const esHistoria = contentType === 'Story'
  const iniciales = (business?.nombre || 'Mi tienda').split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
  const faltaTexto = !content?.trim()
  const sinRedes = activeAccountsList.length === 0

  return (
    <div className="marketing-col-right">
      <div className="mk-card">
        <div className="mk-card-head">
          <div>
            <h3>Vista previa</h3>
            <p>Así se verá en Facebook e Instagram. Haz clic en el texto para editarlo.</p>
          </div>
        </div>

        <div className="mk-segmented" style={{ marginBottom: '14px' }}>
          {formatos.map((f) => (
            <button key={f.id} type="button" className={contentType === f.id ? 'is-active' : ''} onClick={() => setContentType(f.id)}>
              {f.label}
            </button>
          ))}
        </div>

        {esVideo && (
          <div className="mk-script" style={{ marginBottom: '14px' }}>
            {guionVideo ? (
              pasosGuion.filter(([clave]) => guionVideo[clave]).map(([clave, titulo]) => (
                <div key={clave} className="mk-script-step">
                  <span>{titulo}</span>
                  <p>{guionVideo[clave]}</p>
                </div>
              ))
            ) : (
              <p className="mk-hint" style={{ margin: 0 }}>
                Presiona «Escribir guion con IA» para obtener un guion paso a paso para grabar tu video.
                Para publicarlo, sube el video directamente en la app de Instagram o TikTok.
              </p>
            )}
          </div>
        )}

        <div className="mk-preview">
          <div className="mk-preview-head">
            <div className="mk-avatar">
              {business?.logoUrl ? <img src={business.logoUrl} alt="" /> : iniciales}
            </div>
            <div>
              <strong>{business?.nombre || 'Mi tienda'}</strong>
              <small>{esHistoria ? 'Historia' : 'Ahora'}</small>
            </div>
          </div>

          <div className={`mk-media ${esHistoria ? 'is-story' : ''}`}>
            {uploadedImage ? (
              <img src={uploadedImage} alt="Imagen de la publicación" />
            ) : (
              <div className="mk-media-empty">
                <ImageIcon size={26} />
                <span>Sin imagen. Sube una foto o créala con IA.</span>
              </div>
            )}
          </div>

          <textarea
            className="mk-caption"
            value={content}
            onChange={(e) => setContent?.(e.target.value)}
            placeholder="El texto de tu publicación aparecerá aquí al presionar «Redactar con IA». También puedes escribirlo tú."
          />
          <div className="mk-caption-foot">
            <span>{esHistoria ? 'En historias de Instagram el texto no se muestra; úsalo en Facebook.' : ''}</span>
            <span>{content?.length || 0} caracteres</span>
          </div>
        </div>

        <div className="mk-btn-row" style={{ marginTop: '12px' }}>
          <button type="button" className="mk-btn" onClick={copyText} disabled={faltaTexto}>
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copiado' : 'Copiar texto'}
          </button>
          <button type="button" className="mk-btn" onClick={generate} disabled={loading}>
            <RotateCw size={14} /> Redactar otra versión
          </button>
        </div>
      </div>

      <div className="mk-card">
        <div className="mk-card-head">
          <div>
            <h3>Publicar</h3>
            <p>Hora de Perú. Sugerencia: 9:00 a. m. o 6:00 p. m. suelen tener más interacción.</p>
          </div>
        </div>

        {!puedePublicar ? (
          <div className="mk-plan-bloqueo">
            <Lock size={18} />
            <p>Publicar y programar en Facebook e Instagram es parte del <strong>plan Pro</strong>. Mientras tanto, copia el texto y súbelo tú desde la app.</p>
            <a href={pagarProUrl()} className="mk-btn mk-btn-primary">Pasar a Pro · S/ 39 al mes</a>
          </div>
        ) : (
          <>
          <div className="mk-segmented">
            <button type="button" className={publishMode === 'ahora' ? 'is-active' : ''} onClick={() => setPublishMode('ahora')}>
              Ahora
            </button>
            <button type="button" className={publishMode === 'programar' ? 'is-active' : ''} onClick={() => setPublishMode('programar')}>
              Programar
            </button>
          </div>

          {publishMode === 'programar' && (
            <div className="mk-schedule">
              <div>
                <label>Fecha</label>
                <input className="mk-input" type="date" value={scheduleDate} min={new Date().toLocaleDateString('en-CA')} onChange={(e) => setScheduleDate(e.target.value)} />
              </div>
              <div>
                <label>Hora</label>
                <input className="mk-input" type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} />
              </div>
            </div>
          )}

          <div className="mk-targets">
            <span>Se publicará en:</span>
            {sinRedes
              ? <span style={{ color: '#b45309' }}>elige al menos una red conectada</span>
              : activeAccountsList.map((acc) => <span key={acc.id} className="mk-target">{acc.name}</span>)}
          </div>
          {faltaTexto && <small className="mk-warn">Primero redacta o escribe el texto de la publicación.</small>}

          <button
            type="button"
            className="mk-btn mk-btn-primary mk-btn-block"
            disabled={sinRedes || publishing || faltaTexto || esVideo}
            onClick={handlePublishOrSchedule}
            title={esVideo ? 'Los guiones de video se graban y publican desde la app de cada red' : undefined}
          >
            {publishMode === 'programar' ? <CalendarDays size={16} /> : <Send size={16} />}
            {publishing ? 'Enviando…' : publishMode === 'programar' ? 'Programar publicación' : 'Publicar ahora'}
          </button>
          </>
        )}
      </div>
    </div>
  )
}
