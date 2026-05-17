// Sidebar lateral de la TiendaPage
// Muestra acciones rápidas (WhatsApp, carrito), horario, teléfono y badge de verificación
import { MapPin, Clock, Phone, ShieldCheck, ShoppingCart, MessageCircle } from 'lucide-react'
import './SidebarNegocio.css'

function SidebarNegocio({ negocio, totalItems, subtotal, onAbrirCarrito, onWhatsApp }) {
  return (
    <div className="sidebar">

      <div className="sidebar-card">
        <h4 className="sidebar-title">Te interesa algo?</h4>
        <p className="sidebar-sub">Agrega productos al carrito o contacta directamente por WhatsApp.</p>

        {totalItems > 0 && (
          <div className="sidebar-carrito-preview">
            <span>{totalItems} producto(s) en carrito</span>
            <span className="sidebar-subtotal">S/ {subtotal}.00</span>
          </div>
        )}

        <button className="sidebar-btn-whatsapp" onClick={onWhatsApp}>
          <MessageCircle size={16} color="white" />
          Escribir por WhatsApp
        </button>

        {totalItems > 0 && (
          <button className="sidebar-btn-carrito" onClick={onAbrirCarrito}>
            <ShoppingCart size={16} color="var(--dark)" />
            Ver carrito ({totalItems})
          </button>
        )}

        <button className="sidebar-btn-catalogo">
          Ver catalogo externo
        </button>
      </div>

      <div className="sidebar-card">
        <h4 className="sidebar-title">Horario de atencion</h4>
        <div className="sidebar-info-item">
          <Clock size={14} color="#00B894" />
          <span>{negocio.horario}</span>
        </div>
        <div className="sidebar-info-item">
          <Phone size={14} color="#00B894" />
          <span>{negocio.telefono}</span>
        </div>
      </div>

      <div className="sidebar-card sidebar-verificado">
        <div className="sidebar-verificado-title">
          <ShieldCheck size={16} color="#00B894" />
          Negocio verificado
        </div>
        <p>Este negocio paso por nuestro proceso de verificacion de datos.</p>
      </div>

    </div>
  )
}

export default SidebarNegocio