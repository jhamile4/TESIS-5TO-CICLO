import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import ChatCrecio from '../LandingPage/ChatCrecio'
import { getNegocios } from '../../services/apiPublico'

const GRAIN = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")"

const CATEGORIA_ICONS = {
  'Restaurante': 'ri-restaurant-line',
  'Moda':        'ri-t-shirt-line',
  'Ferreteria':  'ri-tools-line',
  'Panaderia':   'ri-cake-line',
  'Tecnologia':  'ri-computer-line',
  'Flores':      'ri-plant-line',
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden animate-pulse">
      <div className="h-48 bg-[#F3F4F6]" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-[#F3F4F6] rounded w-1/3" />
        <div className="h-4 bg-[#F3F4F6] rounded w-2/3" />
        <div className="h-3 bg-[#F3F4F6] rounded w-1/2" />
        <div className="h-9 bg-[#F3F4F6] rounded-xl mt-4" />
      </div>
    </div>
  )
}

function NegocioCard({ n }) {
  const navigate = useNavigate()
  return (
    <div
      className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden cursor-pointer hover:shadow-lg hover:border-[#0D9488]/30 hover:-translate-y-1 transition-all duration-300 group flex flex-col"
      onClick={() => navigate(`/tienda/${n.id}`)}
    >
      <div className="relative h-48 overflow-hidden bg-[#F3F4F6] shrink-0">
        {n.img
          ? <img src={n.img} alt={n.nombre} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-full flex items-center justify-center"><i className="ri-store-2-line text-5xl text-[#D1D5DB]" /></div>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#374151] text-[10px] font-semibold px-2.5 py-1 rounded-full">
          {n.categoria}
        </span>
        {n.verificado && (
          <span className="absolute top-3 right-3 bg-[#0D9488] text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <i className="ri-shield-check-line" /> Verificado
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h4 className="font-bold text-[#111827] text-sm leading-snug truncate">{n.nombre}</h4>
        <div className="flex items-center gap-1 mt-1">
          <i className="ri-star-fill text-amber-400 text-xs" />
          <span className="text-xs font-semibold text-[#111827]">{n.rating || '—'}</span>
          <span className="text-[10px] text-[#9CA3AF]">({n.resenas || 0} reseñas)</span>
        </div>
        {(n.distrito || n.direccion) && (
          <div className="flex items-center gap-1 mt-1.5 text-[#6B7280]">
            <i className="ri-map-pin-line text-[10px] shrink-0" />
            <span className="text-[11px] truncate">{n.distrito || n.direccion}</span>
          </div>
        )}
        {n.horario && (
          <div className="flex items-center gap-1 mt-1 text-[#6B7280]">
            <i className="ri-time-line text-[10px] shrink-0" />
            <span className="text-[11px] truncate">{n.horario}</span>
          </div>
        )}
        <button
          className="mt-auto pt-3 w-full py-2.5 bg-[#111827] hover:bg-[#0D9488] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
          onClick={e => { e.stopPropagation(); navigate(`/tienda/${n.id}`) }}
        >
          <i className="ri-store-2-line" />
          Ver tienda
        </button>
      </div>
    </div>
  )
}

function DirectorioPage() {
  const [negocios,   setNegocios]   = useState([])
  const [cargando,   setCargando]   = useState(true)
  const [busqueda,   setBusqueda]   = useState('')
  const [categoria,  setCategoria]  = useState('Todos')
  const [loaded,     setLoaded]     = useState(false)

  useEffect(() => {
    setTimeout(() => setLoaded(true), 80)
    getNegocios()
      .then(data => { setNegocios(data); setCargando(false) })
      .catch(() => setCargando(false))
  }, [])

  const categorias = useMemo(() => (
    ['Todos', ...new Set(negocios.map(n => n.categoria).filter(Boolean))]
  ), [negocios])

  const negociosFiltrados = useMemo(() => (
    negocios.filter(n => {
      const porCategoria = categoria === 'Todos' || n.categoria === categoria
      const porBusqueda  = n.nombre.toLowerCase().includes(busqueda.toLowerCase())
      return porCategoria && porBusqueda
    })
  ), [negocios, categoria, busqueda])

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />

      {/* ── Hero cinematográfico ── */}
      <section className="relative overflow-hidden bg-[#060a0a]" style={{ minHeight: '78vh' }}>

        {/* Video de fondo */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay muted loop playsInline
            className="absolute inset-0 h-full w-full object-cover"
            poster="https://images.unsplash.com/photo-1555529902-5261145633bf?w=1920&q=80"
          >
            <source src="https://videos.pexels.com/video-files/3252078/3252078-hd_1280_720_25fps.mp4" type="video/mp4" />
          </video>

          {/* Overlay degradado */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/55 to-[#0D9488]/25" />

          {/* Textura de grano sutil */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: GRAIN }} />
        </div>

        {/* Píldoras flotantes decorativas — solo desktop */}
        <div className="hidden lg:block">
          {[
            { icon: 'ri-restaurant-line', label: 'Restaurante', top: '28%', left: '6%',  delay: '0.4s'  },
            { icon: 'ri-t-shirt-line',    label: 'Moda',        top: '55%', left: '4%',  delay: '0.7s'  },
            { icon: 'ri-tools-line',      label: 'Ferretería',  top: '72%', left: '10%', delay: '1.1s'  },
            { icon: 'ri-cake-line',       label: 'Panadería',   top: '28%', right: '6%', delay: '0.5s'  },
            { icon: 'ri-computer-line',   label: 'Tecnología',  top: '52%', right: '4%', delay: '0.9s'  },
            { icon: 'ri-plant-line',      label: 'Flores',      top: '70%', right: '9%', delay: '1.3s'  },
          ].map((p, i) => (
            <div
              key={i}
              className="absolute z-10 flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-semibold text-white/75 backdrop-blur-md transition-all duration-1000"
              style={{
                top: p.top, left: p.left, right: p.right,
                opacity:   loaded ? 1 : 0,
                transform: loaded ? 'translateY(0)' : 'translateY(12px)',
                transitionDelay: p.delay,
              }}
            >
              <i className={`${p.icon} text-[#0D9488]`} />
              {p.label}
            </div>
          ))}
        </div>

        {/* Contenido central */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-36 pb-28 md:pt-44 md:pb-32">

          {/* Badge */}
          <div
            className="mb-8 transition-all duration-1000"
            style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(16px)' }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-5 py-2 text-xs font-medium tracking-widest text-white/80 backdrop-blur-md uppercase">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0D9488] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0D9488]" />
              </span>
              Directorio CRECIO · Perú
            </span>
          </div>

          {/* Título principal */}
          <h1
            className="max-w-4xl transition-all duration-1000"
            style={{
              opacity:   loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(24px)',
              transitionDelay: '0.2s',
            }}
          >
            <span className="block text-5xl font-extrabold leading-[1.04] tracking-tight text-white md:text-7xl lg:text-8xl">
              Descubre los
            </span>
            <span className="block text-5xl font-extrabold leading-[1.04] tracking-tight text-white md:text-7xl lg:text-8xl">
              mejores negocios
            </span>
            <span className="block bg-gradient-to-r from-[#0D9488] via-[#14B8A6] to-[#2DD4BF] bg-clip-text text-5xl font-extrabold leading-[1.04] tracking-tight text-transparent md:text-7xl lg:text-8xl">
              cerca de ti
            </span>
          </h1>

          {/* Subtítulo */}
          <p
            className="mt-7 max-w-lg text-base leading-relaxed text-white/55 md:text-lg transition-all duration-1000"
            style={{
              opacity:   loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: '0.45s',
            }}
          >
            Tiendas, restaurantes, farmacias y más — todos con catálogo digital y precios actualizados.
          </p>

          {/* Barra de búsqueda */}
          <div
            className="mt-10 w-full max-w-2xl transition-all duration-1000"
            style={{
              opacity:   loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: '0.65s',
            }}
          >
            <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-4 shadow-2xl shadow-black/40">
              <i className="ri-search-line text-[#9CA3AF] text-xl shrink-0" />
              <input
                type="text"
                placeholder="Busca una tienda, restaurante, servicio..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="flex-1 bg-transparent text-sm text-[#111827] outline-none placeholder-[#9CA3AF]"
              />
              {busqueda
                ? (
                  <button onClick={() => setBusqueda('')} className="text-[#9CA3AF] hover:text-[#374151] cursor-pointer shrink-0">
                    <i className="ri-close-line text-lg" />
                  </button>
                ) : (
                  <kbd className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-[#E5E7EB] px-2 py-1 text-[10px] font-semibold text-[#9CA3AF]">
                    Enter
                  </kbd>
                )
              }
            </div>
          </div>

          {/* Stats dinámicos */}
          <div
            className="mt-8 flex flex-wrap items-center justify-center gap-8 text-xs text-white/45 transition-all duration-1000"
            style={{
              opacity:   loaded ? 1 : 0,
              transitionDelay: '0.9s',
            }}
          >
            <div className="flex items-center gap-2">
              <i className="ri-store-2-line text-[#0D9488] text-base" />
              <span>
                {cargando ? '...' : `${negocios.length} negocios`}
              </span>
            </div>
            <div className="w-px h-3 bg-white/20" />
            <div className="flex items-center gap-2">
              <i className="ri-map-pin-2-line text-[#0D9488] text-base" />
              <span>Lima, Perú</span>
            </div>
            <div className="w-px h-3 bg-white/20" />
            <div className="flex items-center gap-2">
              <i className="ri-shield-check-line text-[#0D9488] text-base" />
              <span>Todos verificados</span>
            </div>
          </div>
        </div>

        {/* Fade inferior hacia el fondo de la página */}
        <div className="absolute bottom-0 left-0 right-0 z-10 h-28 bg-gradient-to-t from-[#F9FAFB] to-transparent" />
      </section>

      {/* ── Filtros de categoría sticky ── */}
      <div className="sticky top-16 md:top-24 z-30 bg-white border-b border-[#E5E7EB] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-3">
            {cargando
              ? [...Array(6)].map((_, i) => (
                  <div key={i} className="h-8 w-24 bg-[#F3F4F6] rounded-full animate-pulse shrink-0" />
                ))
              : categorias.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoria(cat)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                      categoria === cat
                        ? 'bg-[#111827] text-white'
                        : 'bg-white border border-[#E5E7EB] text-[#374151] hover:border-[#0D9488] hover:text-[#0D9488]'
                    }`}
                  >
                    {CATEGORIA_ICONS[cat] && <i className={`${CATEGORIA_ICONS[cat]} text-[10px]`} />}
                    {cat}
                  </button>
                ))
            }
          </div>
        </div>
      </div>

      {/* ── Grid de negocios ── */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">

        {!cargando && (
          <p className="text-xs text-[#9CA3AF] mb-5">
            {negociosFiltrados.length === 0
              ? 'Sin resultados'
              : `${negociosFiltrados.length} negocio${negociosFiltrados.length !== 1 ? 's' : ''} encontrado${negociosFiltrados.length !== 1 ? 's' : ''}`
            }
          </p>
        )}

        {cargando ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(9)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : negociosFiltrados.length === 0 ? (
          <div className="text-center py-20">
            <i className="ri-store-2-line text-5xl text-[#E5E7EB] block mb-4" />
            <p className="text-sm font-semibold text-[#374151] mb-1">No encontramos negocios</p>
            <p className="text-xs text-[#9CA3AF]">Intenta con otra búsqueda o categoría.</p>
            <button
              onClick={() => { setBusqueda(''); setCategoria('Todos') }}
              className="mt-5 px-5 py-2.5 bg-[#0D9488] text-white text-xs font-bold rounded-full cursor-pointer hover:bg-[#0F766E] transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {negociosFiltrados.map(n => <NegocioCard key={n.id} n={n} />)}
          </div>
        )}
      </div>

      <ChatCrecio />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .bg-white\\/8 { background-color: rgba(255,255,255,0.08); }
      `}</style>
    </div>
  )
}

export default DirectorioPage
