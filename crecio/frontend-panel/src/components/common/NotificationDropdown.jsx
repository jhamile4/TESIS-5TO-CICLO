import { useState, useRef, useEffect } from 'react'
import { ShoppingBag, Package, DollarSign, Sparkles } from 'lucide-react'

export default function NotificationDropdown({ isOpen, onClose }) {
  const dropdownRef = useRef(null)

  const notifications = [
    {
      id: 1,
      type: 'order',
      icon: ShoppingBag,
      iconBg: '#e6fffa',
      iconColor: '#0d9488',
      text: 'Nueva orden recibida: ORD-009 por S/ 189.00',
      time: '2 min',
      tag: 'Órdenes',
      unread: true,
    },
    {
      id: 2,
      type: 'inventory',
      icon: Package,
      iconBg: '#fff7ed',
      iconColor: '#f97316',
      text: 'Stock bajo: Botella Térmica (3 unidades restantes)',
      time: '15 min',
      tag: 'Inventario',
      unread: true,
    },
    {
      id: 3,
      type: 'finance',
      icon: DollarSign,
      iconBg: '#f0fdf4',
      iconColor: '#16a34a',
      text: 'Pago confirmado: ORD-007 por S/ 245.00',
      time: '1 h',
      tag: 'Finanzas',
      unread: false,
    },
    {
      id: 4,
      type: 'marketing',
      icon: Sparkles,
      iconBg: '#fdf2f8',
      iconColor: '#ec4899',
      text: "Campaña 'Promoción Verano' alcanzó 500 impresiones",
      time: '3 h',
      tag: 'Marketing IA',
      unread: false,
    },
  ]

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

  return (
    <div className="notif-dropdown-popover" ref={dropdownRef}>
      <div className="notif-header">
        <h4>Notificaciones</h4>
        <button className="notif-mark-all">Marcar todo</button>
      </div>

      <div className="notif-list">
        {notifications.map((n) => {
          const Icon = n.icon
          return (
            <div key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`}>
              <div
                className="notif-icon-circle"
                style={{ backgroundColor: n.iconBg, color: n.iconColor }}
              >
                {Icon && <Icon size={16} />}
              </div>
              <div className="notif-content">
                <p className="notif-text">{n.text}</p>
                <div className="notif-meta">
                  <span className="notif-time">{n.time}</span>
                  <span className="notif-tag">{n.tag}</span>
                </div>
              </div>
              {n.unread && <span className="notif-unread-dot" />}
            </div>
          )
        })}
      </div>

      <div className="notif-footer">
        <button className="notif-view-all">Ver todas</button>
      </div>
    </div>
  )
}
