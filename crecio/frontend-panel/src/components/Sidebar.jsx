import { Boxes, ChartNoAxesCombined, ChevronRight, CircleDollarSign, LayoutDashboard, Settings, ShoppingBag, Sparkles, Store, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navigation = [
  [LayoutDashboard, 'Inicio', '/'], [Boxes, 'Inventarios', '/inventario'], [ShoppingBag, 'Ventas', '/ventas'],
  [Sparkles, 'Marketing IA', '/marketing'], [Users, 'Clientes', '/clientes'], [CircleDollarSign, 'Finanzas', '/finanzas'], [Store, 'Mi tienda', '/tienda'],
]

export default function Sidebar({ business }) {
  const { user, logout } = useAuth()
  return <aside className="sidebar">
    <div className="sidebar-brand"><div className="brand-mark small"><ChartNoAxesCombined size={21} /></div><div><strong>Crecio</strong><span>Panel de Control</span></div></div>
    <nav>{navigation.map(([Icon, label, to]) => <NavLink key={label} to={to} end={to === '/'} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><Icon size={19} />{label}{(label === 'Finanzas' || label === 'Mi tienda') && <small className="nav-soon">Próximamente</small>}</NavLink>)}</nav>
    <div className="sidebar-bottom"><button className="collapse-button"><ChevronRight size={18} />Contraer</button><div className="business-profile"><div className="business-avatar">{business?.logoUrl ? <img src={business.logoUrl} alt="" /> : (business?.nombre || user?.nombre || 'N').charAt(0).toUpperCase()}</div><div className="business-info"><b>{business?.nombre || 'Mi negocio'}</b><span>Administrador</span></div><button className="business-settings" title="Configuración del negocio"><Settings size={18} /></button></div><button className="sidebar-logout" onClick={logout}>Cerrar sesión</button></div>
  </aside>
}
