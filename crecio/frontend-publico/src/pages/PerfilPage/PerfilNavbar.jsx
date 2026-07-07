import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../components/Navbar/Navbar.css'

const BASE_URL = 'http://localhost:3001/api'

// ── Modal de búsqueda ──
function BuscadorModal({ onClose }) {
  const navigate                    = useNavigate()
  const [query, setQuery]           = useState('')
  const [resultados, setResultados] = useState({ productos: [], negocios: [] })
  const [cargando, setCargando]     = useState(false)
  const inputRef                    = useRef(null)
  const debounceRef                 = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const buscar = (q) => {
    setQuery(q)
    clearTimeout(debounceRef.current)
    if (q.length < 2) { setResultados({ productos: [], negocios: [] }); return }
    setCargando(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res  = await fetch(`${BASE_URL}/cuenta/buscar?q=${encodeURIComponent(q)}`)
        const data = await res.json()
        setResultados(data)
      } catch {}
      finally { setCargando(false) }
    }, 350)
  }

  const hayResultados = resultados.productos.length > 0 || resultados.negocios.length > 0

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-md"
      onClick={onClose}>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'dropIn 0.2s ease-out' }}>

        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#F3F4F6]">
          <i className="ri-search-line text-[#6B7280] text-lg shrink-0" />
          <input ref={inputRef} type="text" placeholder="Buscar productos, tiendas..."
            value={query} onChange={e => buscar(e.target.value)}
            className="flex-1 text-sm text-[#111827] outline-none placeholder-[#9CA3AF] bg-transparent" />
          {query && (
            <button onClick={() => buscar('')} className="text-[#9CA3AF] hover:text-[#374151] cursor-pointer">
              <i className="ri-close-line text-lg" />
            </button>
          )}
          <span className="text-[10px] text-[#9CA3AF] bg-[#F3F4F6] px-2 py-1 rounded-md font-mono shrink-0">ESC</span>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {cargando && (
            <div className="flex items-center justify-center py-8">
              <i className="ri-loader-4-line animate-spin text-[#0D9488] text-xl" />
            </div>
          )}

          {!cargando && query.length >= 2 && !hayResultados && (
            <div className="text-center py-10">
              <i className="ri-search-line text-4xl text-[#E5E7EB] block mb-2" />
              <p className="text-sm text-[#9CA3AF]">Sin resultados para "<strong>{query}</strong>"</p>
            </div>
          )}

          {!cargando && resultados.negocios.length > 0 && (
            <div className="px-4 py-3">
              <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Tiendas</p>
              {resultados.negocios.map((n, i) => (
                <button key={i} onClick={() => { navigate(`/tienda/${n.pk_id}`); onClose() }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#F3F4F6] transition-colors cursor-pointer text-left group">
                  {n.img
                    ? <img src={n.img} alt={n.nombre} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                    : <div className="w-10 h-10 rounded-xl bg-[#0D9488]/10 flex items-center justify-center shrink-0"><i className="ri-store-2-line text-[#0D9488]" /></div>
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#111827] truncate">{n.nombre}</p>
                    <p className="text-xs text-[#9CA3AF]">{n.categoria} · {n.direccion}</p>
                  </div>
                  <i className="ri-arrow-right-line text-[#9CA3AF] group-hover:text-[#0D9488] transition-colors" />
                </button>
              ))}
            </div>
          )}

          {!cargando && resultados.productos.length > 0 && (
            <div className="px-4 py-3 border-t border-[#F3F4F6]">
              <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Productos</p>
              {resultados.productos.map((p, i) => (
                <button key={i} onClick={() => { navigate(`/tienda/${p.negocio_id}`); onClose() }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#F0FDF9] transition-colors cursor-pointer text-left group">
                  {p.img
                    ? <img src={p.img} alt={p.nombre} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    : <div className="w-12 h-12 rounded-xl bg-[#F3F4F6] flex items-center justify-center shrink-0"><i className="ri-image-line text-[#D1D5DB] text-xl" /></div>
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#111827] truncate">{p.nombre}</p>
                    <p className="text-xs text-[#9CA3AF] truncate">{p.negocio_nombre} · {p.categoria}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {p.precio_oferta
                      ? <><p className="text-sm font-black text-[#0D9488]">S/ {Number(p.precio_oferta).toFixed(2)}</p><p className="text-[10px] text-[#9CA3AF] line-through">S/ {Number(p.precio).toFixed(2)}</p></>
                      : <p className="text-sm font-black text-[#111827]">S/ {Number(p.precio).toFixed(2)}</p>
                    }
                  </div>
                </button>
              ))}
            </div>
          )}

          {!query && (
            <div className="px-4 py-6 text-center">
              <i className="ri-search-line text-3xl text-[#E5E7EB] block mb-2" />
              <p className="text-xs text-[#9CA3AF]">Escribe al menos 2 caracteres para buscar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Colores para el avatar según inicial ──
const AVATAR_COLORS = [
  '#EA580C', '#DC2626', '#9333EA', '#2563EB',
  '#059669', '#D97706', '#DB2777', '#0891B2',
]
const getAvatarColor = (nombre) => {
  if (!nombre) return AVATAR_COLORS[0]
  const idx = nombre.charCodeAt(0) % AVATAR_COLORS.length
  return AVATAR_COLORS[idx]
}

// ── Navbar principal ──
function PerfilNavbar({ comprador }) {
  const navigate                = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [buscando, setBuscando] = useState(false)
  const menuRef                 = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 280)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleCerrarSesion = () => {
    ['token_comprador','comprador','token','cliente'].forEach(k => localStorage.removeItem(k))
    window.dispatchEvent(new Event('compradorActualizado'))
    navigate('/')
  }

  const initials    = comprador?.nombre?.split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase() || '?'
  const avatarColor = getAvatarColor(comprador?.nombre)
  const navClass = scrolled
    ? 'bg-black/95 backdrop-blur-md border-b border-white/10 shadow-xl shadow-black/30 text-white'
    : 'bg-white/90 backdrop-blur-md border-b border-[#E5E7EB] shadow-sm text-[#111827]'

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navClass}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <div 
            className="logo-container-group flex items-center gap-2.5 cursor-pointer select-none shrink-0" 
            onClick={() => navigate('/')}
          >
            {/* 3D Holographic Growth Bars Icon */}
            <div className="w-5 h-5 relative perspective-sm shrink-0 flex items-end gap-[2px] pb-[1px]">
              <div className="logo-prism-wrapper w-full h-full relative transform-style-3d">
                <div className="logo-bars-back !gap-[2px]">
                  <div className="logo-bar-back-1 !w-[4px] !h-[8px]" />
                  <div className="logo-bar-back-2 !w-[4px] !h-[13px]" />
                  <div className="logo-bar-back-3 !w-[4px] !h-[18px]" />
                </div>
                <div className="logo-bars-front !gap-[2px]">
                  <div className="logo-bar-front-1 !w-[4px] !h-[8px]" />
                  <div className="logo-bar-front-2 !w-[4px] !h-[13px]" />
                  <div className="logo-bar-front-3 !w-[4px] !h-[18px]" />
                </div>
              </div>
            </div>
            {/* Wordmark */}
            <span className="font-sans font-bold text-sm tracking-tight flex items-center">
              <span className={`transition-colors duration-300 ${scrolled ? 'text-white' : 'text-[#111827]'}`}>CRE</span>
              <span className="text-[#0D9488]">CIO</span>
            </span>
          </div>

          {/* Centro — links de navegación */}
          <div className="hidden md:flex items-center gap-1">
            <button onClick={() => navigate('/tiendas')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold font-sans tracking-wide transition-all cursor-pointer ${
                scrolled 
                  ? 'text-white/60 hover:text-white hover:bg-white/5' 
                  : 'text-[#374151] hover:text-black hover:bg-[#F3F4F6]'
              }`}>
              <i className="ri-store-2-line text-sm text-[#0D9488]" /> Tiendas
            </button>
            <button onClick={() => navigate('/perfil')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold font-sans tracking-wide transition-all cursor-pointer ${
                scrolled 
                  ? 'text-white/60 hover:text-white hover:bg-white/5' 
                  : 'text-[#374151] hover:text-black hover:bg-[#F3F4F6]'
              }`}>
              <i className="ri-user-line text-sm text-[#0D9488]" /> Mi cuenta
            </button>
            {comprador?.esEmprendedor && (
              <button onClick={() => navigate('/panel')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold font-sans tracking-wide transition-all cursor-pointer ${
                  scrolled 
                    ? 'text-white/60 hover:text-white hover:bg-white/5' 
                    : 'text-[#374151] hover:text-black hover:bg-[#F3F4F6]'
                }`}>
                <i className="ri-dashboard-line text-sm text-[#0D9488]" /> Panel
              </button>
            )}
          </div>

          {/* Derecha — Buscador + Avatar */}
          <div className="flex items-center gap-3">
            {/* Lupa / Buscador Capsule */}
            <button 
              onClick={() => setBuscando(true)}
              className={`hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all duration-200 cursor-pointer shadow-sm ${
                scrolled 
                  ? 'bg-white/5 hover:bg-white/10 border-white/5 hover:border-white/10 text-white/40 hover:text-white' 
                  : 'bg-[#F8FAFC] hover:bg-slate-100/60 border-slate-200/80 hover:border-slate-300 text-slate-400 hover:text-slate-700 shadow-slate-100/10'
              }`}
            >
              <i className="ri-search-2-line text-sm text-[#0D9488]/70" />
              <span>Buscar...</span>
              <kbd className={`hidden md:inline-flex items-center justify-center h-4 px-1.5 rounded text-[9px] font-mono font-medium transition-all ${
                scrolled 
                  ? 'bg-white/10 border-white/10 text-white/55' 
                  : 'bg-white border border-slate-200 text-slate-400 shadow-sm'
              }`}>⌘K</kbd>
            </button>

            <button 
              onClick={() => setBuscando(true)}
              className={`sm:hidden w-8 h-8 flex items-center justify-center rounded-xl transition-all cursor-pointer border ${
                scrolled 
                  ? 'bg-white/5 border-white/5 text-white/70 hover:text-white' 
                  : 'bg-[#F8FAFC] border-slate-200/80 hover:bg-slate-100 text-[#374151]'
              }`}
            >
              <i className="ri-search-2-line text-base text-[#0D9488]/70" />
            </button>

            {/* Mi Panel mobile */}
            {comprador?.esEmprendedor && (
              <button onClick={() => navigate('/panel')}
                className={`md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  scrolled 
                    ? 'bg-white/10 hover:bg-white/20 border-white/10 text-white' 
                    : 'bg-white hover:bg-slate-50 border-[#E5E7EB] hover:border-[#0D9488]/30 text-[#374151]'
                }`}>
                <i className="ri-dashboard-line text-sm" />
                Panel
              </button>
            )}

            {/* Avatar con dropdown */}
            <div className="relative" ref={menuRef}>
              <button onClick={() => setMenuOpen(!menuOpen)}
                className={`flex items-center gap-2.5 p-1 pr-3.5 rounded-full border transition-all duration-200 cursor-pointer group ${
                  scrolled
                    ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                    : 'bg-slate-50/50 border-slate-100 hover:bg-slate-100/60 hover:border-slate-200'
                }`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 transition-all shadow-sm ${
                    scrolled ? 'ring-2 ring-white/15' : 'ring-2 ring-black/5'
                  }`}
                  style={{ background: avatarColor }}
                >
                  {initials}
                </div>
                <div className="hidden md:flex items-center gap-1.5">
                  <span className={`text-[12px] font-semibold tracking-wide transition-colors ${
                    scrolled ? 'text-white/80 group-hover:text-white' : 'text-slate-700 group-hover:text-black'
                  }`}>{comprador?.nombre?.split(' ')[0]}</span>
                  <i className={`ri-chevron-down-line text-xs transition-transform duration-200 ${
                    scrolled ? 'text-white/45' : 'text-slate-400'
                  } ${menuOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <div
                  className={`absolute right-0 top-12 rounded-2xl shadow-2xl border overflow-hidden z-50 transition-all ${
                    scrolled 
                      ? 'bg-[#0f172a]/95 backdrop-blur-2xl border-white/10 text-white' 
                      : 'bg-white/95 backdrop-blur-2xl border-[#E5E7EB] text-[#111827]'
                  }`}
                  style={{ animation: 'dropIn 0.2s ease-out', minWidth: '260px' }}
                >
                  {/* Header */}
                  <div className={`flex items-center gap-3 px-4 py-4 border-b ${scrolled ? 'border-white/10' : 'border-[#F3F4F6]'}`}>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                      style={{ background: avatarColor }}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate ${scrolled ? 'text-white' : 'text-[#111827]'}`}>{comprador?.nombre}</p>
                      <p className={`text-[10px] truncate ${scrolled ? 'text-white/50' : 'text-[#6B7280]'}`}>{comprador?.email}</p>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${
                        scrolled ? 'bg-white/10 text-white/60' : 'bg-[#F3F4F6] text-[#0D9488]'
                      }`}>
                        Cliente CRECIO
                      </span>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="py-1.5">
                    {[
                      { icon: 'ri-user-line',      label: 'Mis Datos',        sub: 'Perfil y configuración', action: () => { navigate('/perfil'); setMenuOpen(false) } },
                      ...(comprador?.esEmprendedor ? [{ icon: 'ri-dashboard-line', label: 'Mi Panel', sub: 'Gestiona tu negocio', action: () => { navigate('/panel'); setMenuOpen(false) } }] : []),
                      { icon: 'ri-heart-line',     label: 'Favoritos',        sub: 'Productos guardados',    action: () => { navigate('/perfil'); setMenuOpen(false) } },
                      { icon: 'ri-store-2-line',   label: 'Explorar Tiendas', sub: 'Descubrir negocios',     action: () => { navigate('/tiendas'); setMenuOpen(false) } },
                    ].map((item, i) => (
                      <button key={i} onClick={item.action}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors cursor-pointer text-left ${
                          scrolled ? 'hover:bg-white/5' : 'hover:bg-[#F3F4F6]'
                        }`}>
                        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${
                          scrolled ? 'bg-white/8 border-white/8' : 'bg-[#FAFAFA] border-[#E5E7EB]'
                        }`}>
                          <i className={`${item.icon} text-sm ${scrolled ? 'text-white/60' : 'text-[#6B7280]'}`} />
                        </div>
                        <div>
                          <p className={`text-xs font-semibold ${scrolled ? 'text-white' : 'text-[#374151]'}`}>{item.label}</p>
                          <p className={`text-[10px] ${scrolled ? 'text-white/35' : 'text-[#9CA3AF]'}`}>{item.sub}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Cerrar sesión */}
                  <div className={`border-t p-1.5 ${scrolled ? 'border-white/10' : 'border-[#F3F4F6]'}`}>
                    <button onClick={handleCerrarSesion}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer">
                      <i className="ri-logout-box-line text-red-400 text-sm" />
                      <span className="text-xs font-semibold text-red-400">Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </nav>

      {/* Modal búsqueda */}
      {buscando && <BuscadorModal onClose={() => setBuscando(false)} />}

      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes dropInUp {
          from { opacity: 0; transform: translateY(12px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .hover\\:bg-white\\/8:hover { background-color: rgba(255,255,255,0.08); }
      `}</style>
    </>
  )
}

export default PerfilNavbar