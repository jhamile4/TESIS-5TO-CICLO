import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logoCrecio from '../../assets/logoCrecio.png'

const Navbar = () => {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const bgClass = scrolled
    ? 'bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-sm'
    : 'bg-transparent border-b border-transparent'

  const textColor   = scrolled ? 'text-[#374151]' : 'text-white'
  const logoFilter  = scrolled ? '' : 'brightness-0 invert'
  const hamburgerColor = scrolled ? 'text-[#1E293B]' : 'text-white'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${bgClass}`}>
      {/* Contenedor más alto — h-16 móvil, h-24 desktop igual al ref */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-24">

        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img
            src={logoCrecio}
            alt="CRECIO"
            className={`h-7 md:h-9 w-auto object-contain transition-all duration-500 ${logoFilter}`}
          />
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { label: 'Inicio',        id: 'inicio'        },
            { label: 'Cómo funciona', id: 'como-funciona' },
            { label: 'Directorio',    id: 'buscar'        },
            { label: 'Herramientas',  id: 'ia-tools'      },
            { label: 'Precios',       id: 'precios'       },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`px-3 py-2 text-[13px] font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap hover:text-[#0D9488] ${textColor}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className={`px-4 py-2 text-[13px] font-semibold rounded-md transition-all cursor-pointer hover:text-[#0D9488] ${textColor}`}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => navigate('/registro')}
            className="px-5 py-2.5 text-[13px] font-bold rounded-full bg-[#0D9488] text-white hover:bg-[#0F766E] transition-all whitespace-nowrap cursor-pointer inline-flex items-center gap-1.5"
          >
            Crear mi tienda gratis
          </button>
        </div>

        {/* Hamburger */}
        <button
          className={`md:hidden w-8 h-8 flex items-center justify-center cursor-pointer transition-colors ${hamburgerColor}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <i className={`text-xl ${menuOpen ? 'ri-close-line' : 'ri-menu-line'}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-40 px-6 py-6 flex flex-col gap-1 overflow-y-auto">
          {[
            { label: 'Inicio',        id: 'inicio'        },
            { label: 'Cómo funciona', id: 'como-funciona' },
            { label: 'Directorio',    id: 'buscar'        },
            { label: 'Herramientas',  id: 'ia-tools'      },
            { label: 'Precios',       id: 'precios'       },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-left text-[#374151] font-medium py-3 text-base border-b border-[#F3F4F6] cursor-pointer hover:text-[#0D9488] transition-colors"
            >
              {item.label}
            </button>
          ))}
          <div className="flex flex-col gap-3 pt-6">
            <button
              onClick={() => { navigate('/login'); setMenuOpen(false) }}
              className="w-full py-3 rounded-xl border border-[#E5E7EB] text-[#374151] font-semibold text-sm hover:border-[#0D9488] hover:text-[#0D9488] transition-all cursor-pointer"
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => { navigate('/registro'); setMenuOpen(false) }}
              className="w-full py-3 rounded-xl bg-[#0D9488] text-white font-bold text-sm hover:bg-[#0F766E] transition-all cursor-pointer"
            >
              Crear mi tienda gratis
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar