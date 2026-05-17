import './ResenasList.css'

function ResenasList({ reviews }) {
  return (
    <div className="resenas-list">
      {reviews.map((r, i) => (
        <div className="resena-card" key={i}>
          <div className="resena-header">
            <div className="resena-avatar">{r.nombre.charAt(0)}</div>
            <div>
              <div className="resena-nombre">{r.nombre}</div>
              <div className="resena-estrellas">
                {Array.from({ length: r.estrellas }).map((_, j) => (
                  <span key={j}>★</span>
                ))}
              </div>
            </div>
            <div className="resena-tiempo">{r.tiempo}</div>
          </div>
          <p className="resena-texto">{r.texto}</p>
        </div>
      ))}
    </div>
  )
}

export default ResenasList