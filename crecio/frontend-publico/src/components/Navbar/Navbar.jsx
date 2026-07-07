import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  const navigate  = useNavigate()
  const location  = useLocation()
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [comprador, setComprador] = useState(null)

  const esPaginaBlanca = ['/perfil', '/login', '/registro', '/verificar'].some(p =>
    location.pathname.startsWith(p)
  )
  const esLanding = location.pathname === '/'

  useEffect(() => {
    if (esPaginaBlanca) { setScrolled(true); return }
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [esPaginaBlanca, location.pathname])

  useEffect(() => {
    const cargarComprador = () => {
      const c = localStorage.getItem('comprador')
      setComprador(c ? JSON.parse(c) : null)
    }
    cargarComprador()
    window.addEventListener('compradorActualizado', cargarComprador)
    return () => window.removeEventListener('compradorActualizado', cargarComprador)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleNavLink = (id, href) => {
    setMenuOpen(false)
    if (href) { navigate(href); return }
    if (esLanding) {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(`/#${id}`)
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }
  }

  const bgClass    = scrolled ? 'bg-white/80 backdrop-blur-lg border-b border-[#E5E7EB]/50 shadow-sm' : 'bg-transparent border-b border-transparent'
  const textColor  = scrolled ? 'text-[#374151]' : 'text-white'

  const navLinks = [
    { label: 'Inicio',        id: 'inicio'        },
    { label: 'Cómo funciona', id: 'como-funciona' },
    { label: 'Explorar tiendas', id: 'buscar', href: '/tiendas' },
    { label: 'Herramientas',  id: 'ia-tools'      },
    { label: 'Precios',       id: 'precios'       },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-24">

        {/* Logo */}
        <div 
          className="logo-container-group flex items-center gap-3.5 cursor-pointer select-none relative" 
          onClick={() => navigate('/')}
        >
          {/* 3D Holographic Growth Bars Icon */}
          <div className="w-6 h-6 relative perspective-sm shrink-0 flex items-end gap-[3px] pb-[1px]">
            <div className="logo-prism-wrapper w-full h-full relative transform-style-3d">
              {/* Back Face (Translucent Teal Glass Bars) */}
              <div className="logo-bars-back">
                <div className="logo-bar-back-1" />
                <div className="logo-bar-back-2" />
                <div className="logo-bar-back-3" />
              </div>
              {/* Front Face (Glowing Teal Gradient Bars) */}
              <div className="logo-bars-front">
                <div className="logo-bar-front-1" />
                <div className="logo-bar-front-2" />
                <div className="logo-bar-front-3" />
              </div>
            </div>
          </div>
          
          {/* Bold custom logo text with 3D slot-machine rise */}
          <div className="logo-text-holder flex items-center h-7 select-none">
            <span className="logo-word flex items-center tracking-tighter">
              <span className="logo-char-wrapper">
                <span className={`logo-char-3d ${scrolled || esPaginaBlanca ? 'text-[#111827]' : 'text-white'} transition-colors duration-500`}>C</span>
              </span>
              <span className="logo-char-wrapper">
                <span className={`logo-char-3d ${scrolled || esPaginaBlanca ? 'text-[#111827]' : 'text-white'} transition-colors duration-500`}>R</span>
              </span>
              <span className="logo-char-wrapper">
                <span className={`logo-char-3d ${scrolled || esPaginaBlanca ? 'text-[#111827]' : 'text-white'} transition-colors duration-500`}>E</span>
              </span>
              <span className="logo-char-wrapper">
                <span className="logo-char-3d text-[#0D9488]">C</span>
              </span>
              <span className="logo-char-wrapper">
                <span className="logo-char-3d text-[#0D9488]">I</span>
              </span>
              <span className="logo-char-wrapper">
                <span className="logo-char-3d text-[#0D9488]">O</span>
              </span>
            </span>
          </div>
        </div>

        {/* Desktop nav — oculto en páginas blancas */}
        {!esPaginaBlanca && (
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavLink(item.id, item.href)}
                className={`relative px-3 py-2 text-[13.5px] font-semibold transition-colors cursor-pointer whitespace-nowrap hover:text-[#0D9488] ${textColor} group`}
              >
                {item.label}
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#0D9488] transform scale-x-0 transition-transform duration-300 origin-center group-hover:scale-x-100" />
              </button>
            ))}
          </div>
        )}

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-4">
          {comprador ? (
            <div className="relative group">
              {/* Clic en avatar → perfil */}
              <button
                onClick={() => navigate('/perfil')}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-[#0D9488] hover:bg-[#0F766E] flex items-center justify-center shadow-sm hover:shadow-md transition-all shrink-0">
                  <span className="text-sm font-bold text-white">
                    {comprador.nombre?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className={`hidden lg:block text-left transition-colors ${textColor} group-hover:text-[#0D9488]`}>
                  <p className="text-xs font-bold leading-none">{comprador.nombre}</p>
                  <p className="text-[10px] opacity-60 mt-0.5">Mi cuenta ▾</p>
                </div>
              </button>

              {/* Dropdown aparece al hacer hover */}
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-[#E5E7EB]/70 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {comprador.esEmprendedor && (
                  <button
                    onClick={() => navigate('/panel')}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F0FDF9] hover:text-[#0D9488] transition-colors cursor-pointer"
                  >
                    <i className="ri-dashboard-line text-base text-[#0D9488]" />
                    Mi panel de negocio
                  </button>
                )}
                <button
                  onClick={() => navigate('/tiendas')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F0FDF9] hover:text-[#0D9488] transition-colors cursor-pointer"
                >
                  <i className="ri-shopping-bag-line text-base text-[#0D9488]" />
                  Comprar algo
                </button>
                <div className="border-t border-[#E5E7EB]/70 my-1" />
                <button
                  onClick={() => {
                    localStorage.removeItem('comprador')
                    localStorage.removeItem('token')
                    localStorage.removeItem('token_comprador')
                    localStorage.removeItem('cliente')
                    window.dispatchEvent(new Event('compradorActualizado'))
                    navigate('/')
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <i className="ri-logout-box-line text-base" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className={`relative px-4 py-2 text-[13.5px] font-semibold rounded-md transition-all cursor-pointer hover:text-[#0D9488] ${textColor} group`}
              >
                Iniciar sesión
                <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#0D9488] transform scale-x-0 transition-transform duration-300 origin-center group-hover:scale-x-100" />
              </button>
              <button
                onClick={() => navigate('/registro')}
                className="px-5 py-2.5 text-[13.5px] font-bold rounded-full bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white transition-all shadow-md shadow-[#0D9488]/10 hover:shadow-lg hover:shadow-[#0D9488]/25 hover:scale-[1.03] active:scale-[0.98] whitespace-nowrap cursor-pointer"
              >
                Crear mi tienda gratis
              </button>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className={`md:hidden w-8 h-8 flex items-center justify-center cursor-pointer ${textColor}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i className={`text-xl ${menuOpen ? 'ri-close-line' : 'ri-menu-line'}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-white/95 backdrop-blur-lg z-40 px-6 py-6 flex flex-col gap-1 overflow-y-auto shadow-2xl animate-fade-in-down">
          {!esPaginaBlanca && navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavLink(item.id, item.href)}
              className="text-left text-[#374151] font-semibold py-3.5 text-base border-b border-[#F3F4F6] cursor-pointer hover:text-[#0D9488] hover:pl-2 transition-all duration-300 flex items-center justify-between group"
            >
              {item.label}
              <i className="ri-arrow-right-s-line opacity-0 group-hover:opacity-100 transition-all text-[#0D9488]" />
            </button>
          ))}
          <div className="flex flex-col gap-3 pt-6">
            {comprador ? (
              <>
                <button
                  onClick={() => { navigate('/perfil'); setMenuOpen(false) }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#0D9488]/10 hover:shadow-lg transition-all"
                >
                  <i className="ri-user-line" />
                  Mi perfil — {comprador.nombre}
                </button>
                {comprador.esEmprendedor && (
                  <button
                    onClick={() => { navigate('/panel'); setMenuOpen(false) }}
                    className="w-full py-3.5 rounded-xl border border-[#0D9488] text-[#0D9488] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer hover:bg-[#0D9488]/5 transition-colors"
                  >
                    <i className="ri-dashboard-line" />
                    Mi panel de negocio
                  </button>
                )}
                <button
                  onClick={() => { navigate('/tiendas'); setMenuOpen(false) }}
                  className="w-full py-3.5 rounded-xl border border-[#E5E7EB] text-[#374151] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer hover:bg-[#FAFAFA] transition-colors"
                >
                  <i className="ri-shopping-bag-line text-[#0D9488]" />
                  Comprar algo
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('comprador')
                    localStorage.removeItem('token')
                    localStorage.removeItem('token_comprador')
                    localStorage.removeItem('cliente')
                    window.dispatchEvent(new Event('compradorActualizado'))
                    navigate('/')
                    setMenuOpen(false)
                  }}
                  className="w-full py-3.5 rounded-xl border border-red-200 text-red-500 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer hover:bg-red-50 transition-colors"
                >
                  <i className="ri-logout-box-line" />
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { navigate('/login'); setMenuOpen(false) }}
                  className="w-full py-3.5 rounded-xl border border-[#E5E7EB] text-[#374151] font-bold text-sm cursor-pointer hover:border-[#0D9488] hover:text-[#0D9488] transition-all text-center"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => { navigate('/registro'); setMenuOpen(false) }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white font-bold text-sm cursor-pointer hover:opacity-95 shadow-md shadow-[#0D9488]/15 transition-all text-center"
                >
                  Crear mi tienda gratis
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar