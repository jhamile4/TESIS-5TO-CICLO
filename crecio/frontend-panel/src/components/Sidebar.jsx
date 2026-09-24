import {
  Boxes,
  ChartNoAxesCombined,
  ChevronRight,
  CircleDollarSign,
  LayoutDashboard,
  Settings,
  ShoppingBag,
  Sparkles,
  Store,
  Users,
  LogOut
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PUBLIC_URL } from '../config/env'

const navigation = [
  [LayoutDashboard, 'Inicio', '/'],
  [Boxes, 'Inventarios', '/inventario'],
  [ShoppingBag, 'Ventas', '/ventas'],
  [Sparkles, 'Marketing IA', '/marketing'],
  [Users, 'Clientes', '/clientes'],
  [CircleDollarSign, 'Finanzas', '/finanzas'],
  [Store, 'Mi tienda', '/tienda']
]

export default function Sidebar({ business }) {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    window.location.assign(`${PUBLIC_URL}/login`)
  }

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-mark small">
          <ChartNoAxesCombined size={21} />
        </div>
        <div>
          <strong>Crecio</strong>
          <span>Panel de Control</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav>
        {navigation.map(([Icon, label, to]) => (
          <NavLink
            key={label}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={19} />
            <span>{label}</span>
            <i className="active-dot-indicator"></i>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="sidebar-bottom">
        <button className="collapse-button">
          <ChevronRight size={18} />
          <span>Contraer</span>
        </button>

        {/* User Profile Card & Logout */}
        <div className="business-profile-card">
          <div className="business-profile-main">
            <div className="business-avatar">
              {business?.logoUrl ? (
                <img src={business.logoUrl} alt="Logo" />
              ) : (
                (business?.nombre || user?.nombre || 'B').charAt(0).toUpperCase()
              )}
            </div>
            <div className="business-info">
              <b>{business?.nombre || user?.nombre || 'Barbados Admin'}</b>
              <span>{user?.rol || 'Administrador'}</span>
            </div>
            <button className="business-settings" title="Configuración">
              <Settings size={17} />
            </button>
          </div>

          <button className="sleek-logout-btn" onClick={handleLogout} title="Cerrar sesión">
            <LogOut size={14} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
