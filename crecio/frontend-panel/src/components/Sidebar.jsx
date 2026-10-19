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
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PUBLIC_URL } from '../config/env'
import BrandLogo from './common/BrandLogo'

const navigation = [
  [LayoutDashboard, 'Inicio', '/'],
  [Boxes, 'Inventarios', '/inventario'],
  [ShoppingBag, 'Ventas', '/ventas'],
  [Sparkles, 'Marketing IA', '/marketing'],
  [Users, 'Clientes', '/clientes'],
  [CircleDollarSign, 'Finanzas', '/finanzas'],
  [Store, 'Mi tienda', '/tienda'],
]

export default function Sidebar({ business, abiertoMovil, onCerrarMovil }) {
  // Se recuerda si el dueño prefiere el menú contraído
  const [contraido, setContraido] = useState(() => { try { return localStorage.getItem('crecio_menu_contraido') === '1' } catch { return false } })
  const alternarContraido = () => {
    setContraido((v) => {
      try { localStorage.setItem('crecio_menu_contraido', v ? '0' : '1') } catch { /* sin almacenamiento */ }
      return !v
    })
  }

  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    window.location.assign(`${PUBLIC_URL}`)
  }

  return (
    <aside className={`sidebar ${contraido ? 'is-collapsed' : ''} ${abiertoMovil ? 'is-open-mobile' : ''}`}>
      {/* Logo: el mismo del sitio público */}
      <div className="sidebar-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <BrandLogo subtitle="Panel de Control" />
      </div>

      {/* Main Navigation */}
      <nav>
        {navigation.map(([Icon, label, to]) => (
          <NavLink
            key={label}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onCerrarMovil}
            title={label}
          >
            <Icon size={19} />
            <span>{label}</span>
            <i className="active-dot-indicator"></i>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="sidebar-bottom">
        <button className="collapse-button" onClick={alternarContraido} title={contraido ? 'Expandir menú' : 'Contraer menú'}>
          <ChevronRight size={18} />
          <span>{contraido ? 'Expandir' : 'Contraer'}</span>
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
