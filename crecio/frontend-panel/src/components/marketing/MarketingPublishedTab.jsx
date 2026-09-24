import { Heart, MessageCircle, Share2 } from 'lucide-react'

export default function MarketingPublishedTab({ publishedPosts }) {
  return (
    <div className="tab-view-container">
      <div className="tab-view-header">
        <h3>Publicaciones Realizadas</h3>
        <p>Historial de todo el contenido que ya publicaste en tus redes sociales.</p>
      </div>

      <div className="posts-cards-grid three-cols">
        {publishedPosts.map((post) => (
          <div key={post.id} className="published-card">
            <div className="post-card-img-wrap">
              <img src={post.image} alt="Published post" />
              <span className="status-badge green-badge">PUBLICADO</span>
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
              <div className="published-metrics-footer">
                <span className="pub-date">{post.date}</span>
                <div className="metrics-group">
                  <span>
                    <Heart size={12} /> {post.likes}
                  </span>
                  <span>
                    <MessageCircle size={12} /> {post.comments}
                  </span>
                  <span>
                    <Share2 size={12} /> {post.shares}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
