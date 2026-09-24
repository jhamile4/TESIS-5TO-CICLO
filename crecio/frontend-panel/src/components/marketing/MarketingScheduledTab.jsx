import { Clock, Edit3, Trash2 } from 'lucide-react'

export default function MarketingScheduledTab({ scheduledPosts }) {
  return (
    <div className="tab-view-container">
      <div className="tab-view-header">
        <h3>Publicaciones Programadas</h3>
        <p>Contenido que se publicará automáticamente en la fecha y hora indicada.</p>
      </div>

      <div className="posts-cards-grid">
        {scheduledPosts.map((post) => (
          <div key={post.id} className="scheduled-card">
            <div className="post-card-img-wrap">
              <img src={post.image} alt="Scheduled post" />
              <span className="status-badge orange-badge">PROGRAMADO</span>
            </div>
            <div className="post-card-body">
              <div className="platforms-pills-row">
                {post.platforms.map((p) => (
                  <span key={p} className="p-pill">
                    {p}
                  </span>
                ))}
              </div>
              <p className="post-card-text">{post.text}</p>
              <div className="post-card-date">
                <Clock size={14} /> {post.date}
              </div>
              <div className="post-card-actions">
                <button className="btn-edit">
                  <Edit3 size={13} /> Editar
                </button>
                <button className="btn-cancel">
                  <Trash2 size={13} /> Cancelar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
