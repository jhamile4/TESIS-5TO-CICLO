import { useState, useEffect } from 'react'
import { useNavigate }         from 'react-router-dom'
import PerfilNavbar            from './PerfilNavbar'
import PerfilHero              from './PerfilHero'
import TabInicio               from './tabs/TabInicio'
import TabPedidos              from './tabs/TabPedidos'
import TabFavoritos            from './tabs/TabFavoritos'
import TabParaTi               from './tabs/TabParaTi'
import TabTiendas              from './tabs/TabTiendas'
import TabDatos                from './tabs/TabDatos'

const BASE_URL = 'http://localhost:3001/api'

const apiFetch = async (path, token, options = {}) => {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res  = await fetch(`${BASE_URL}${path}`, { headers, ...options })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || res.status.toString())
  return data
}

const cargarTodo = async (token) => {
  const [p, ped, favs, vis, of, pt, car] = await Promise.all([
    apiFetch('/perfil/me', token),
    apiFetch('/perfil/pedidos', token),
    apiFetch('/cuenta/favoritos', token),
    apiFetch('/cuenta/vistos', token),
    apiFetch('/cuenta/ofertas', null),
    apiFetch('/cuenta/para-ti', token),
    apiFetch('/cuenta/carrito', token),
  ])
  return { p, ped, favs, vis, of, pt, car }
}

function PerfilPage() {
  const navigate = useNavigate()
  const token    = localStorage.getItem('token_comprador')

  const [tab, setTab]                             = useState('inicio')
  const [perfil, setPerfil]                       = useState(null)
  const [pedidos, setPedidos]                     = useState([])
  const [favoritos, setFavoritos]                 = useState([])
  const [favData, setFavData]                     = useState([])
  const [vistos, setVistos]                       = useState([])
  const [ofertas, setOfertas]                     = useState([])
  const [paraTi, setParaTi]                       = useState([])
  const [carritoAbandonado, setCarritoAbandonado] = useState([])
  const [cargando, setCargando]                   = useState(true)
  const [heroLoaded, setHeroLoaded]               = useState(false)
  const [errorRed, setErrorRed]                   = useState(false)

  const aplicarDatos = ({ p, ped, favs, vis, of, pt, car }) => {
    setPerfil(p)
    setPedidos(ped)
    setFavData(favs); setFavoritos(favs.map(f => f.producto_id))
    setVistos(vis); setOfertas(of); setParaTi(pt)
    setCarritoAbandonado(car)
    setCargando(false)
    setErrorRed(false)
  }

  useEffect(() => {
    if (!token) { navigate('/'); return }
    setTimeout(() => setHeroLoaded(true), 300)

    // Primer intento
    cargarTodo(token)
      .then(aplicarDatos)
      .catch(async (err) => {
        console.warn('Primer intento fallido, reintentando en 2s...', err.message)

        // Esperar 2 segundos y reintentar
        await new Promise(r => setTimeout(r, 2000))

        try {
          const datos = await cargarTodo(token)
          aplicarDatos(datos)
        } catch (err2) {
          console.error('Segundo intento fallido:', err2.message)

          const esError401 = err2.message?.includes('401') || err2.message?.includes('Token') || err2.message?.includes('invalido')

          if (esError401) {
            // Token inválido — cerrar sesión
            localStorage.removeItem('token_comprador')
            localStorage.removeItem('comprador')
            navigate('/')
          } else {
            // Error de red — mostrar datos del caché
            const compradorLocal = JSON.parse(localStorage.getItem('comprador') || '{}')
            if (compradorLocal.id || compradorLocal.pk_id) {
              setPerfil(compradorLocal)
              setErrorRed(true)
            } else {
              navigate('/')
            }
            setCargando(false)
          }
        }
      })
  }, [])

  const handleToggleFav = async (producto_id) => {
    if (!token) return
    try {
      const res = await apiFetch('/cuenta/favoritos/toggle', token, {
        method: 'POST', body: JSON.stringify({ producto_id })
      })
      if (res.favorito) {
        setFavoritos(p => [...p, producto_id])
        const prod = [...vistos, ...ofertas, ...paraTi].find(p => p.producto_id === producto_id)
        if (prod) setFavData(p => [...p, prod])
      } else {
        setFavoritos(p => p.filter(id => id !== producto_id))
        setFavData(p => p.filter(f => f.producto_id !== producto_id))
      }
    } catch {}
  }

  const handleGuardar = async (nuevoNombre) => {
    const res = await apiFetch('/perfil/me', token, {
      method: 'PUT', body: JSON.stringify({ nombre: nuevoNombre })
    })
    setPerfil(res.cliente)
    localStorage.setItem('comprador', JSON.stringify(res.cliente))
    window.dispatchEvent(new Event('compradorActualizado'))
  }

  const handleCerrarSesion = () => {
    ['token_comprador','comprador','token','cliente'].forEach(k => localStorage.removeItem(k))
    window.dispatchEvent(new Event('compradorActualizado'))
    navigate('/')
  }

  const pagados    = pedidos.filter(p => p.estado === 'pagado').length
  const pendientes = pedidos.filter(p => p.estado === 'pendiente').length
  const tiendas    = [...new Map(
    pedidos.filter(p => p.negocio_id).map(p => [p.negocio_id, { id: p.negocio_id, nombre: p.negocio_nombre, logo: p.negocio_logo }])
  ).values()]

  const TABS = [
    { key: 'inicio',    label: 'Inicio',    icon: 'ri-home-line'         },
    { key: 'pedidos',   label: 'Pedidos',   icon: 'ri-file-list-3-line', badge: pedidos.length },
    { key: 'favoritos', label: 'Favoritos', icon: 'ri-heart-line',       badge: favData.length },
    { key: 'para-ti',   label: 'Para vos',  icon: 'ri-magic-line'        },
    { key: 'tiendas',   label: 'Tiendas',   icon: 'ri-store-2-line'      },
    { key: 'datos',     label: 'Mis Datos', icon: 'ri-user-line'         },
  ]

  if (cargando) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <i className="ri-loader-4-line animate-spin text-2xl text-[#0D9488]" />
        <p className="text-xs text-[#9CA3AF]">Cargando tu cuenta...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
          <PerfilNavbar comprador={{
              ...perfil,
              esEmprendedor: JSON.parse(localStorage.getItem('comprador') || '{}').esEmprendedor ?? false
          }} />

      {/* Banner error de red */}
      {errorRed && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
          <i className="ri-wifi-off-line" />
          Sin conexión — mostrando datos guardados
        </div>
      )}

      <PerfilHero
        heroLoaded={heroLoaded}
        onDescubrir={() => document.getElementById('cuenta-content')?.scrollIntoView({ behavior: 'smooth' })}
      />

      {/* Sub-navbar blanco sticky */}
      <div className="sticky top-16 md:top-20 z-40 bg-white border-b border-[#E5E7EB] shadow-sm">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  tab === t.key ? 'bg-[#111827] text-white' : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6]'
                }`}>
                <i className={t.icon} />
                {t.label}
                {t.badge > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${tab === t.key ? 'bg-white/20' : 'bg-[#0D9488] text-white'}`}>
                    {t.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div id="cuenta-content" className="max-w-4xl mx-auto px-4 md:px-8 py-6">
        {tab === 'inicio' && (
          <TabInicio
            perfil={perfil} pedidos={pedidos} ofertas={ofertas}
            carritoAbandonado={carritoAbandonado} vistos={vistos} tiendas={tiendas}
            pagados={pagados} pendientes={pendientes}
            navigate={navigate} token={token}
            favoritos={favoritos} onToggleFav={handleToggleFav}
            onVerTab={setTab}
          />
        )}
        {tab === 'pedidos' && (
          <TabPedidos pedidos={pedidos} pagados={pagados} pendientes={pendientes} navigate={navigate} />
        )}
        {tab === 'favoritos' && (
          <TabFavoritos favData={favData} navigate={navigate} onToggleFav={handleToggleFav} />
        )}
        {tab === 'para-ti' && (
          <TabParaTi paraTi={paraTi} navigate={navigate} favoritos={favoritos} onToggleFav={handleToggleFav} />
        )}
        {tab === 'tiendas' && (
          <TabTiendas tiendas={tiendas} pedidos={pedidos} navigate={navigate} />
        )}
        {tab === 'datos' && (
          <TabDatos perfil={perfil} onGuardar={handleGuardar} onCerrarSesion={handleCerrarSesion} />
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}

export default PerfilPage