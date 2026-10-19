import { Clock, Trash2, AlertTriangle } from 'lucide-react'

const ESTADOS = {
  programado: { texto: 'PROGRAMADO', clase: 'orange-badge' },
  publicando: { texto: 'PUBLICANDO…', clase: 'orange-badge' },
  fallido:    { texto: 'NO SE PUBLICÓ', clase: 'orange-badge', estilo: { background: '#dc2626' } },
}

const formatearFecha = (fecha) =>
  new Date(fecha).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' })

export default function MarketingScheduledTab({ scheduledPosts, onCancel }) {
  return (
    <div className="tab-view-container">
      <div className="tab-view-header">
        <h3>Publicaciones Programadas</h3>
        <p>Se publican solas en Facebook e Instagram a la fecha y hora indicada (hora de Perú).</p>
      </div>

      {scheduledPosts.length === 0 && (
        <div className="empty-state-box">
          <Clock size={32} />
          <p>No tienes publicaciones programadas. Crea una y elige "Programar".</p>
        </div>
      )}

      <div className="posts-cards-grid">
        {scheduledPosts.map((post) => {
          const estado = ESTADOS[post.estado] || ESTADOS.programado
          return (
            <div key={post.id} className="scheduled-card">
              <div className="post-card-img-wrap">
                {post.image ? <img src={post.image} alt="Scheduled post" /> : <div style={{ height: '100%', minHeight: '140px', display: 'grid', placeItems: 'center', background: '#f1f5f9', color: '#94a3b8', fontSize: '12px' }}>Solo texto</div>}
                <span className={`status-badge ${estado.clase}`} style={estado.estilo}>{estado.texto}</span>
              </div>
              <div className="post-card-body">
                <div className="platforms-pills-row">
                  {post.platforms.map((p) => (
                    <span key={p} className="p-pill" style={{ textTransform: 'capitalize' }}>
                      {p}
                    </span>
                  ))}
                </div>
                <p className="post-card-text">{post.text}</p>
                <div className="post-card-date">
                  <Clock size={14} /> {formatearFecha(post.date)}
                </div>
                {post.estado === 'fallido' && post.error && (
                  <p style={{ display: 'flex', gap: '6px', fontSize: '11px', color: '#b91c1c', margin: '0 0 10px' }}>
                    <AlertTriangle size={13} style={{ flexShrink: 0 }} /> {post.error}
                  </p>
                )}
                {post.estado !== 'publicando' && (
                  <div className="post-card-actions">
                    <button className="btn-cancel" onClick={() => onCancel(post)}>
                      <Trash2 size={13} /> {post.estado === 'fallido' ? 'Quitar' : 'Cancelar'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
