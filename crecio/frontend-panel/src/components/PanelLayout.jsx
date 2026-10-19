import { Bell, Globe, Menu } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import NotificationDropdown from './common/NotificationDropdown'
import { getResumen, getNotificaciones, marcarNotificacionesLeidas } from '../services/apiAdmin'
import { PUBLIC_URL } from '../config/env'

const titles = {
  '/': 'Inicio',
  '/inventario': 'Inventarios',
  '/ventas': 'Ventas',
  '/clientes': 'Clientes',
  '/marketing': 'Marketing IA',
  '/finanzas': 'Finanzas',
  '/tienda': 'Mi tienda',
  '/configuracion': 'Configuración',
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
  const [menuMovil, setMenuMovil] = useState(false)
  const [notifs, setNotifs] = useState({ noLeidas: 0, notificaciones: [] })

  useEffect(() => {
    getResumen()
      .then((result) => setBusiness(result.negocio))
      .catch(() => {})
  }, [])

  // Revisa nuevas notificaciones cada 30 s (pedidos nuevos, reseñas, stock bajo)
  useEffect(() => {
    const cargar = () => getNotificaciones().then(setNotifs).catch(() => {})
    cargar()
    const intervalo = setInterval(cargar, 30000)
    return () => clearInterval(intervalo)
  }, [])

  const marcarLeidas = () => {
    setNotifs((prev) => ({
      noLeidas: 0,
      notificaciones: prev.notificaciones.map((n) => ({ ...n, leida: true })),
    }))
    marcarNotificacionesLeidas().catch(() => {})
  }

  return (
    <div className="panel-shell">
      <Sidebar business={business} abiertoMovil={menuMovil} onCerrarMovil={() => setMenuMovil(false)} />
      {menuMovil && <div className="sidebar-mobile-backdrop" onClick={() => setMenuMovil(false)} />}

      <main className="dashboard">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button className="icon-button mobile-menu-button" onClick={() => setMenuMovil(true)} title="Abrir menú">
              <Menu size={20} />
            </button>
            <h1>{titles[location.pathname] || 'Panel de Control'}</h1>
          </div>

          <div className="topbar-actions">
            <a
              href={irAComprarUrl()}
              className="go-public-btn"
              title="Ir a comprar con esta misma cuenta"
            >
              <Globe size={16} />
              <span>Ir a comprar</span>
            </a>

            <div className="notif-wrapper">
              <button
                className={`icon-button ${notifs.noLeidas > 0 ? 'notification' : ''}`}
                onClick={() => setShowNotifs(!showNotifs)}
                title="Notificaciones"
              >
                <Bell size={19} />
                {notifs.noLeidas > 0 && (
                  <span className="notif-badge-count">{notifs.noLeidas > 9 ? '9+' : notifs.noLeidas}</span>
                )}
              </button>

              <NotificationDropdown
                isOpen={showNotifs}
                onClose={() => setShowNotifs(false)}
                notificaciones={notifs.notificaciones}
                noLeidas={notifs.noLeidas}
                onMarcarLeidas={marcarLeidas}
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
