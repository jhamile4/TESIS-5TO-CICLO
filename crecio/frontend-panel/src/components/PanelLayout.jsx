import { Bell, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import NotificationDropdown from './common/NotificationDropdown'
import { getResumen } from '../services/apiAdmin'

const titles = {
  '/': 'Inicio',
  '/inventario': 'Inventarios',
  '/ventas': 'Ventas',
  '/clientes': 'Clientes',
  '/marketing': 'Marketing IA',
  '/finanzas': 'Finanzas',
  '/tienda': 'Mi tienda',
}

export default function PanelLayout() {
  const location = useLocation()
  const [business, setBusiness] = useState(null)
  const [showNotifs, setShowNotifs] = useState(false)

  useEffect(() => {
    getResumen()
      .then((result) => setBusiness(result.negocio))
      .catch(() => {})
  }, [])

  return (
    <div className="panel-shell">
      <Sidebar business={business} />

      <main className="dashboard">
        <header className="topbar">
          <h1>{titles[location.pathname] || 'Panel de Control'}</h1>

          <div className="topbar-actions">
            <button className="icon-button" title="Buscar">
              <Search size={19} />
            </button>

            <div className="notif-wrapper">
              <button
                className="icon-button notification"
                onClick={() => setShowNotifs(!showNotifs)}
                title="Notificaciones"
              >
                <Bell size={19} />
                <span className="notif-badge-count">7</span>
              </button>

              <NotificationDropdown
                isOpen={showNotifs}
                onClose={() => setShowNotifs(false)}
              />
            </div>
          </div>
        </header>

        <div className="page-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
