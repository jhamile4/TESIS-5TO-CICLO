import { Bell, Search, Globe } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import NotificationDropdown from './common/NotificationDropdown'
import { getResumen } from '../services/apiAdmin'
import { PUBLIC_URL } from '../config/env'

const titles = {
  '/': 'Inicio',
  '/inventario': 'Inventarios',
  '/ventas': 'Ventas',
  '/clientes': 'Clientes',
  '/marketing': 'Marketing IA',
  '/finanzas': 'Finanzas',
  '/tienda': 'Mi tienda',
}

// Abre el sitio público con la misma cuenta; el token va en el fragmento (#), que no se envía al servidor
const irAComprarUrl = () => {
  const token = localStorage.getItem('crecio_admin_token')
  return token ? `${PUBLIC_URL}/perfil#sesion=${encodeURIComponent(token)}` : `${PUBLIC_URL}/perfil`
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
            <a
              href={irAComprarUrl()}
              className="go-public-btn"
              title="Ir a comprar con esta misma cuenta"
            >
              <Globe size={16} />
              <span>Ir a comprar</span>
            </a>

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
