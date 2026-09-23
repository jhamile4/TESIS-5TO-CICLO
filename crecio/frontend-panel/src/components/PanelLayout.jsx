import { Bell, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import { getResumen } from '../services/apiAdmin'

const titles = { '/': 'Panel de Control', '/inventario': 'Inventario', '/ventas': 'Ventas', '/clientes': 'Clientes', '/marketing': 'Marketing IA', '/finanzas': 'Finanzas', '/tienda': 'Mi tienda' }

export default function PanelLayout() {
  const location = useLocation()
  const [business, setBusiness] = useState(null)
  useEffect(() => { getResumen().then((result) => setBusiness(result.negocio)).catch(() => {}) }, [])
  return <div className="panel-shell"><Sidebar business={business} /><main className="dashboard"><header className="topbar"><h1>{titles[location.pathname] || 'Panel de Control'}</h1><div><button className="icon-button"><Search size={20} /></button><button className="icon-button notification"><Bell size={20} /></button></div></header><Outlet /></main></div>
}
