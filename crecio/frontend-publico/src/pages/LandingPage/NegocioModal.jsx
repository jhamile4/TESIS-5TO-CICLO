import { useState } from 'react'
import { X, MapPin, Clock, Phone, ShieldCheck, MessageCircle, Store } from 'lucide-react'

function NegocioModal({ negocio, onClose }) {
  const [tabActivo, setTabActivo] = useState('productos')

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        <button className="modal-close" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="modal-img-wrap">
          <img src={negocio.img} alt={negocio.nombre} className="modal-img" />
          <span className="modal-verified">
            <ShieldCheck size={13} color="white" />
            Verificado CRECIO
          </span>
          <div className="modal-img-badges">
            <span className="biz-badge-cat">{negocio.categoria}</span>
            <span className="modal-rating">★ {negocio.rating} ({negocio.resenas})</span>
          </div>
        </div>

        <div className="modal-body">
          <h3 className="modal-nombre">{negocio.nombre}</h3>
          <p className="modal-desc">{negocio.desc}</p>

          <div className="modal-info-row">
            <div className="modal-info-item">
              <MapPin size={14} color="#00B894" />
              <div>
                <div className="modal-info-label">DIRECCION</div>
                <div className="modal-info-val">{negocio.direccion}</div>
              </div>
            </div>
            <div className="modal-info-item">
              <Clock size={14} color="#00B894" />
              <div>
                <div className="modal-info-label">HORARIO</div>
                <div className="modal-info-val">{negocio.horario}</div>
              </div>
            </div>
            <div className="modal-info-item">
              <Phone size={14} color="#00B894" />
              <div>
                <div className="modal-info-label">TELEFONO</div>
                <div className="modal-info-val">{negocio.telefono}</div>
              </div>
            </div>
          </div>

          <div className="modal-tabs">
            <button
              className={tabActivo === 'productos' ? 'modal-tab active' : 'modal-tab'}
              onClick={() => setTabActivo('productos')}
            >
              Productos ({negocio.productos.length})
            </button>
            <button
              className={tabActivo === 'resenas' ? 'modal-tab active' : 'modal-tab'}
              onClick={() => setTabActivo('resenas')}
            >
              Resenas ({negocio.reviews.length})
            </button>
          </div>

          {tabActivo === 'productos' && (
            <div className="modal-productos">
              {negocio.productos.map((p, i) => (
                <div className="modal-producto" key={i}>
                  <div className="modal-producto-img">
                    <img src={p.img} alt={p.nombre} />
                  </div>
                  <div className="modal-producto-info">
                    <div className="modal-producto-nombre">{p.nombre}</div>
                    <div className="modal-producto-desc">{p.desc}</div>
                    
                    <a
                      className="modal-producto-whatsapp"
                      href={'https://wa.me/' + negocio.whatsapp + '?text=Hola quiero pedir: ' + encodeURIComponent(p.nombre)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle size={13} color="#00B894" />
                      Pedir por WhatsApp
                    </a>
                  </div>
                  <div className="modal-producto-precio">S/ {p.precio}</div>
                </div>
              ))}
            </div>
          )}

          {tabActivo === 'resenas' && (
            <div className="modal-resenas">
              {negocio.reviews.map((r, i) => (
                <div className="modal-review" key={i}>
                  <div className="modal-review-header">
                    <div className="modal-review-avatar">{r.nombre.charAt(0)}</div>
                    <div>
                      <div className="modal-review-nombre">{r.nombre}</div>
                      <div className="modal-review-estrellas">
                        {Array.from({ length: r.estrellas }).map((_, j) => (
                          <span key={j}>★</span>
                        ))}
                      </div>
                    </div>
                    <div className="modal-review-tiempo">{r.tiempo}</div>
                  </div>
                  <p className="modal-review-texto">{r.texto}</p>
                </div>
              ))}
            </div>
          )}

          <div className="modal-actions">
            <button className="modal-btn-primary">
              <Store size={16} color="white" />
              Ver tienda completa
            </button>
            
            <a
              className="modal-btn-whatsapp"
              href={'https://wa.me/' + negocio.whatsapp}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={16} color="#00B894" />
              Contactar por WhatsApp
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}

export default NegocioModal