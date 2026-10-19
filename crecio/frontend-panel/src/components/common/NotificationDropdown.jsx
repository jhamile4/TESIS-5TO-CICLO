import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Package, Star } from 'lucide-react'

const TIPOS = {
  pedido: { icon: ShoppingBag, iconBg: '#e6fffa', iconColor: '#0d9488', tag: 'Pedidos' },
  resena: { icon: Star,        iconBg: '#fefce8', iconColor: '#ca8a04', tag: 'Reseñas' },
  stock:  { icon: Package,     iconBg: '#fff7ed', iconColor: '#f97316', tag: 'Inventario' },
}

const hace = (fecha) => {
  if (!fecha) return 'Ahora'
  const min = Math.max(0, Math.floor((Date.now() - new Date(fecha).getTime()) / 60000))
  if (min < 1) return 'Ahora'
  if (min < 60) return `${min} min`
  const horas = Math.floor(min / 60)
  if (horas < 24) return `${horas} h`
  const dias = Math.floor(horas / 24)
  return dias === 1 ? 'Ayer' : `${dias} días`
}

export default function NotificationDropdown({ isOpen, onClose, notificaciones, noLeidas, onMarcarLeidas }) {
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const abrir = (n) => {
    onClose()
    navigate(n.link)
  }

  return (
    <div className="notif-dropdown-popover" ref={dropdownRef}>
      <div className="notif-header">
        <h4>Notificaciones</h4>
        {noLeidas > 0 && (
          <button className="notif-mark-all" onClick={onMarcarLeidas}>Marcar todo como leído</button>
        )}
      </div>

      <div className="notif-list">
        {notificaciones.length === 0 && (
          <p className="notif-text" style={{ padding: '24px 16px', textAlign: 'center', color: '#94a3b8' }}>
            No tienes notificaciones por ahora.
          </p>
        )}
        {notificaciones.map((n) => {
          const tipo = TIPOS[n.tipo] || TIPOS.pedido
          const Icon = tipo.icon
          const unread = !n.leida
          return (
            <div
              key={n.id}
              className={`notif-item ${unread ? 'unread' : ''}`}
              onClick={() => abrir(n)}
              style={{ cursor: 'pointer' }}
            >
              <div
                className="notif-icon-circle"
                style={{ backgroundColor: tipo.iconBg, color: tipo.iconColor }}
              >
                <Icon size={16} />
              </div>
              <div className="notif-content">
                <p className="notif-text">{n.texto}</p>
                <div className="notif-meta">
                  <span className="notif-time">{n.tipo === 'stock' ? 'Alerta activa' : hace(n.fecha)}</span>
                  <span className="notif-tag">{tipo.tag}</span>
                </div>
              </div>
              {unread && n.tipo !== 'stock' && <span className="notif-unread-dot" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
