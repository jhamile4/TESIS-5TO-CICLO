import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import logoCrecio from '../../assets/logoCrecio.png'

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

  const handleNavLink = (id) => {
    setMenuOpen(false)
    if (esLanding) {
      // Ya estamos en la landing — hacer scroll directo
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      // Estamos en otra página — ir a landing con hash
      navigate(`/#${id}`)
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }
  }

  const bgClass    = scrolled ? 'bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-sm' : 'bg-transparent border-b border-transparent'
  const textColor  = scrolled ? 'text-[#374151]' : 'text-white'
  const logoFilter = scrolled ? '' : 'brightness-0 invert'

  const navLinks = [
    { label: 'Inicio',        id: 'inicio'        },
    { label: 'Cómo funciona', id: 'como-funciona' },
    { label: 'Directorio',    id: 'buscar'        },
    { label: 'Herramientas',  id: 'ia-tools'      },
    { label: 'Precios',       id: 'precios'       },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-24">

        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <img src={logoCrecio} alt="CRECIO" className={`h-7 md:h-9 w-auto object-contain transition-all duration-500 ${logoFilter}`} />
        </div>

        {/* Desktop nav — oculto en páginas blancas */}
        {!esPaginaBlanca && (
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavLink(item.id)}
                className={`px-3 py-2 text-[13px] font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap hover:text-[#0D9488] ${textColor}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {comprador ? (
            <button
              onClick={() => navigate('/perfil')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-full bg-[#0D9488] flex items-center justify-center shadow-sm group-hover:shadow-md transition-all shrink-0">
                <span className="text-sm font-bold text-white">
                  {comprador.nombre?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className={`hidden lg:block text-left transition-colors ${textColor} group-hover:text-[#0D9488]`}>
                <p className="text-xs font-bold leading-none">{comprador.nombre}</p>
                <p className="text-[10px] opacity-60 mt-0.5">Ver mis pedidos</p>
              </div>
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className={`px-4 py-2 text-[13px] font-semibold rounded-md transition-all cursor-pointer hover:text-[#0D9488] ${textColor}`}
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => navigate('/registro')}
                className="px-5 py-2.5 text-[13px] font-bold rounded-full bg-[#0D9488] text-white hover:bg-[#0F766E] transition-all whitespace-nowrap cursor-pointer"
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
        <div className="md:hidden fixed inset-0 top-16 bg-white z-40 px-6 py-6 flex flex-col gap-1 overflow-y-auto">
          {!esPaginaBlanca && navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavLink(item.id)}
              className="text-left text-[#374151] font-medium py-3 text-base border-b border-[#F3F4F6] cursor-pointer hover:text-[#0D9488] transition-colors"
            >
              {item.label}
            </button>
          ))}
          <div className="flex flex-col gap-3 pt-6">
            {comprador ? (
              <button
                onClick={() => { navigate('/perfil'); setMenuOpen(false) }}
                className="w-full py-3 rounded-xl bg-[#0D9488] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                  {comprador.nombre?.charAt(0).toUpperCase()}
                </div>
                Mi perfil — {comprador.nombre}
              </button>
            ) : (
              <>
                <button
                  onClick={() => { navigate('/login'); setMenuOpen(false) }}
                  className="w-full py-3 rounded-xl border border-[#E5E7EB] text-[#374151] font-semibold text-sm cursor-pointer hover:border-[#0D9488] hover:text-[#0D9488] transition-all"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => { navigate('/registro'); setMenuOpen(false) }}
                  className="w-full py-3 rounded-xl bg-[#0D9488] text-white font-bold text-sm cursor-pointer hover:bg-[#0F766E] transition-all"
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