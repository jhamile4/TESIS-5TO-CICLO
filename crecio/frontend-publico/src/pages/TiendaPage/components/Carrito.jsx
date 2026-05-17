import { X, Trash2, ShoppingBag, CreditCard } from 'lucide-react'
import './Carrito.css'

function Carrito({ carrito, subtotal, onCerrar, onCambiar, onEliminar, onWhatsApp }) {
  return (
    <div className="carrito-overlay" onClick={onCerrar}>
      <div className="carrito-panel" onClick={e => e.stopPropagation()}>

        <div className="carrito-header">
          <h3>Tu pedido</h3>
          <button className="carrito-close" onClick={onCerrar}>
            <X size={18} />
          </button>
        </div>

        <div className="carrito-items">
          {carrito.length === 0 && (
            <p className="carrito-vacio">Tu carrito esta vacio</p>
          )}
          {carrito.map((p, i) => (
            <div className="carrito-item" key={i}>
              <img src={p.img} alt={p.nombre} className="carrito-item-img" />
              <div className="carrito-item-info">
                <div className="carrito-item-nombre">{p.nombre}</div>
                <div className="carrito-item-precio">S/ {p.precio}.00</div>
              </div>
              <div className="carrito-item-controls">
                <button onClick={() => onCambiar(p.nombre, -1)}>-</button>
                <span>{p.cantidad}</span>
                <button onClick={() => onCambiar(p.nombre, 1)}>+</button>
              </div>
              <button className="carrito-item-delete" onClick={() => onEliminar(p.nombre)}>
                <Trash2 size={14} color="#A0AEC0" />
              </button>
            </div>
          ))}
        </div>

        {carrito.length > 0 && (
          <div className="carrito-footer">
            <div className="carrito-subtotal">
              <span>Subtotal</span>
              <span className="carrito-total-num">S/ {subtotal}.00</span>
            </div>
            <button className="carrito-btn-whatsapp" onClick={onWhatsApp}>
              <ShoppingBag size={16} color="white" />
              Pagar y pedir por WhatsApp
            </button>
            <button className="carrito-btn-tarjeta">
              <CreditCard size={16} color="white" />
              Pagar con tarjeta
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default Carrito