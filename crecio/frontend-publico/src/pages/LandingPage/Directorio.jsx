import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NegocioModal from './NegocioModal'
import { getNegocios } from '../../services/apiPublico'

const filtros = ['Todos', 'Restaurante', 'Moda', 'Ferreteria', 'Panaderia', 'Tecnologia', 'Flores']

function Directorio() {
  const navigate = useNavigate()
  const [negocios, setNegocios]               = useState([])
  const [cargando, setCargando]               = useState(true)
  const [filtroActivo, setFiltroActivo]       = useState('Todos')
  const [busqueda, setBusqueda]               = useState('')
  const [negocioSeleccionado, setNegocioSeleccionado] = useState(null)

  useEffect(() => {
    getNegocios()
      .then(data => { setNegocios(data); setCargando(false) })
      .catch(err  => { console.error(err); setCargando(false) })
  }, [])

  const negociosFiltrados = negocios.filter(n => {
    const porCategoria = filtroActivo === 'Todos' || n.categoria === filtroActivo
    const porBusqueda  = n.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return porCategoria && porBusqueda
  })

  return (
    <>
      <section id="buscar" className="py-20 md:py-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">

          {/* Header */}
          <div className="mb-10 md:mb-12 text-center mx-auto max-w-3xl">
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-[#111827] leading-tight mb-4">
              Descubre negocios
              <br />
              <span className="text-[#0D9488]">en tu localidad</span>
            </h2>
            <p className="text-[#6B7280] max-w-md mx-auto text-sm md:text-base leading-relaxed">
              Encuentra tiendas, restaurantes y servicios cerca de ti.
              Todos verificados y con catálogo digital.
            </p>
          </div>

          {/* Search box */}
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-5 md:p-6 max-w-3xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-3 bg-[#FAFAFA] rounded-md px-4 py-3">
                <i className="ri-search-line text-[#9CA3AF] text-base" />
                <input
                  type="text"
                  placeholder="¿Qué buscas? (ej: pollería, ropa...)"
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-[#111827] outline-none placeholder-[#9CA3AF]"
                />
              </div>
              <button className="px-6 py-3 bg-[#0D9488] text-white rounded-md font-semibold text-sm hover:bg-[#0F766E] transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2">
                <i className="ri-search-line" />
                Buscar
              </button>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-2 mt-4">
              {filtros.map(f => (
                <button
                  key={f}
                  onClick={() => setFiltroActivo(f)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    filtroActivo === f
                      ? 'bg-[#0D9488] text-white'
                      : 'bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de negocios */}
          {cargando ? (
            <div className="text-center py-16 text-[#9CA3AF] text-sm">
              <i className="ri-loader-4-line text-3xl animate-spin block mb-3" />
              Cargando negocios...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {negociosFiltrados.map((n, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg overflow-hidden border border-[#E5E7EB] hover:border-[#0D9488]/30 hover:shadow-md transition-all duration-300 cursor-pointer group"
                >
                  {/* Imagen */}
                  <div className="relative" onClick={() => navigate('/tienda/' + n.id)}>
                    <img
                      src={n.img}
                      alt={n.nombre}
                      className="w-full h-44 object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 text-[#374151] text-xs font-medium px-2.5 py-1 rounded">
                        {n.categoria}
                      </span>
                    </div>
                    {n.verificado && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-[#0D9488] text-white text-xs font-medium px-2.5 py-1 rounded flex items-center gap-1">
                          <i className="ri-shield-check-line text-xs" />
                          Verificado
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4" onClick={() => navigate('/tienda/' + n.id)}>
                    <h4 className="font-bold text-[#111827] text-sm mb-1">{n.nombre}</h4>
                    <div className="flex items-center gap-1 mb-2">
                      <i className="ri-star-fill text-amber-400 text-xs" />
                      <span className="text-xs font-semibold text-[#111827]">{n.rating}</span>
                      <span className="text-xs text-[#9CA3AF]">({n.resenas} reseñas)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[#6B7280]">
                        <i className="ri-map-pin-line text-xs" />
                        <span className="text-xs">{n.direccion}</span>
                      </div>
                      <span className="text-[#0D9488] text-xs font-medium flex items-center gap-0.5">
                        <i className="ri-external-link-line text-xs" />
                        Ver página
                      </span>
                    </div>
                  </div>

                  {/* Botón vista rápida */}
                  <div className="px-4 pb-4">
                    <button
                      onClick={e => { e.stopPropagation(); setNegocioSeleccionado(n) }}
                      className="w-full py-2.5 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151] rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <i className="ri-eye-line text-sm" />
                      Vista rápida
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sin resultados */}
          {!cargando && negociosFiltrados.length === 0 && (
            <div className="text-center py-12 text-[#9CA3AF]">
              <i className="ri-search-line text-3xl block mb-3" />
              <p className="text-sm">No encontramos negocios con esa búsqueda.</p>
            </div>
          )}

          {/* Ver todas */}
          {!cargando && negociosFiltrados.length > 0 && (
            <div className="mt-10 text-center">
              <button
                onClick={() => navigate('/tiendas')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#0D9488] text-[#0D9488] text-sm font-bold hover:bg-[#0D9488] hover:text-white transition-all cursor-pointer"
              >
                Ver todas las tiendas
                <i className="ri-arrow-right-line" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Modal vista rápida */}
      {negocioSeleccionado && (
        <NegocioModal
          negocio={negocioSeleccionado}
          onClose={() => setNegocioSeleccionado(null)}
        />
      )}
    </>
  )
}

export default Directorio