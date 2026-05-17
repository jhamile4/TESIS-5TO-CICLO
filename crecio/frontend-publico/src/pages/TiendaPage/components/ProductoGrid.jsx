import { ShoppingCart, MessageCircle } from 'lucide-react'
import './ProductoGrid.css'

function ProductoGrid({ productos, onAgregar, whatsapp }) {
  return (
    <div className="producto-grid">
      {productos.map((p, i) => (
        <div className="producto-card" key={i}>
          <div className="producto-img-wrap">
            <img src={p.img} alt={p.nombre} className="producto-img" />
            <span className="producto-precio">S/ {p.precio}.00</span>
          </div>
          <div className="producto-info">
            <h4 className="producto-nombre">{p.nombre}</h4>
            <p className="producto-desc">{p.desc}</p>
            <div className="producto-actions">
              <button
                className="producto-btn-agregar"
                onClick={() => onAgregar(p)}
              >
                <ShoppingCart size={15} color="white" />
                Agregar al carrito
              </button>
              <a
                className="producto-btn-whatsapp"
                href={'https://wa.me/' + whatsapp + '?text=Hola quiero pedir: ' + p.nombre + ' S/' + p.precio}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={15} color="white" />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductoGrid