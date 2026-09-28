import {
  Boxes,
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
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PUBLIC_URL } from '../config/env'

const navigation = [
  [LayoutDashboard, 'Inicio', '/'],
  [Boxes, 'Inventarios', '/inventario'],
  [ShoppingBag, 'Ventas', '/ventas'],
  [Sparkles, 'Marketing IA', '/marketing'],
  [Users, 'Clientes', '/clientes'],
  [CircleDollarSign, 'Finanzas', '/finanzas'],
  [Store, 'Mi tienda', '/tienda'],
]

export default function Sidebar({ business }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    window.location.assign(`${PUBLIC_URL}/login`)
  }

  return (
    <aside className="sidebar">
      {/* Brand Header — Con el Logo 3D Animado de Crecio */}
      <div 
        className="sidebar-brand logo-container-group cursor-pointer select-none" 
        onClick={() => navigate('/')}
        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '18px 20px' }}
      >
        <div className="w-7 h-7 relative perspective-sm shrink-0 flex items-end gap-[3.5px] pb-[1px]">
          <div className="logo-prism-wrapper w-full h-full relative transform-style-3d">
            <div className="logo-bars-back">
              <div className="logo-bar-back-1" />
              <div className="logo-bar-back-2" />
              <div className="logo-bar-back-3" />
            </div>
            <div className="logo-bars-front">
              <div className="logo-bar-front-1" />
              <div className="logo-bar-front-2" />
              <div className="logo-bar-front-3" />
            </div>
          </div>
        </div>
        
        <div className="logo-text-holder flex flex-col justify-center select-none">
          <div className="logo-word flex items-center tracking-tighter" style={{ fontSize: '25px' }}>
            <span className="logo-char-wrapper" style={{ height: '28px' }}>
              <span className="logo-char-3d text-[#111827]">C</span>
            </span>
            <span className="logo-char-wrapper" style={{ height: '28px' }}>
              <span className="logo-char-3d text-[#111827]">R</span>
            </span>
            <span className="logo-char-wrapper" style={{ height: '28px' }}>
              <span className="logo-char-3d text-[#111827]">E</span>
            </span>
            <span className="logo-char-wrapper" style={{ height: '28px' }}>
              <span className="logo-char-3d text-[#0D9488]">C</span>
            </span>
            <span className="logo-char-wrapper" style={{ height: '28px' }}>
              <span className="logo-char-3d text-[#0D9488]">I</span>
            </span>
            <span className="logo-char-wrapper" style={{ height: '28px' }}>
              <span className="logo-char-3d text-[#0D9488]">O</span>
            </span>
          </div>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', marginTop: '-1px', letterSpacing: '0.2px' }}>
            Panel de Control
          </span>
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
                (business?.nombre || user?.negocioNombre || user?.nombre || 'M').charAt(0).toUpperCase()
              )}
            </div>
            <div className="business-info">
              <b>{business?.nombre || user?.negocioNombre || 'Mi Negocio'}</b>
              <span>{user?.nombre || 'Administrador'}</span>
            </div>
            <button
              className="business-settings"
              title="Configuración"
              onClick={() => navigate('/configuracion')}
            >
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
