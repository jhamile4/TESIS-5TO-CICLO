import { useState, useEffect, useRef } from 'react'

const categorias = ['Restaurante','Moda','Ferreteria','Panaderia','Tecnologia','Flores','Salud','Educacion','Otros']

function Paso1Negocio({ datos, onChange, onSiguiente }) {
  const [errores, setErrores]           = useState({})
  const [sugerencias, setSugerencias]   = useState([])
  const [buscandoGeo, setBuscandoGeo]   = useState(false)
  const [geoError, setGeoError]         = useState(null)
  const [mostrarLista, setMostrarLista] = useState(false)
  const debounceRef = useRef(null)
  const wrapRef     = useRef(null)

  // Cerrar lista al hacer clic fuera
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target))
        setMostrarLista(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const validar = () => {
    const e = {}
    if (!datos.nombre.trim() || datos.nombre.trim().length < 3)
      e.nombre = 'El nombre debe tener al menos 3 caracteres'
    if (!datos.categoria)
      e.categoria = 'Selecciona una categoría'
    if (!datos.whatsapp.trim())
      e.whatsapp = 'El WhatsApp es obligatorio'
    else if (!/^\d{9}$/.test(datos.whatsapp.replace(/\s/g, '')))
      e.whatsapp = 'Debe tener exactamente 9 dígitos (ej: 987654321)'
    setErrores(e)
    return Object.keys(e).length === 0
  }

  // Buscar por texto con Nominatim
  const buscarDirecciones = async (texto) => {
    if (texto.length < 4) { setSugerencias([]); setMostrarLista(false); return }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(texto)}&countrycodes=pe&format=json&limit=5&addressdetails=1`,
        { headers: { 'Accept-Language': 'es' } }
      )
      const data = await res.json()
      setSugerencias(data)
      setMostrarLista(data.length > 0)
    } catch {
      setSugerencias([])
    }
  }

  // Obtener ubicación actual del dispositivo
  const obtenerUbicacion = () => {
    setGeoError(null)
    if (!navigator.geolocation) {
      setGeoError('Tu navegador no soporta geolocalización')
      return
    }
    setBuscandoGeo(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
            { headers: { 'Accept-Language': 'es' } }
          )
          const data = await res.json()
          if (data?.display_name) {
            // Armar dirección legible: calle + distrito + ciudad
            const a = data.address || {}
            const partes = [
              a.road,
              a.house_number,
              a.suburb || a.neighbourhood,
              a.city_district || a.county,
              a.city || a.town,
            ].filter(Boolean)
            const direccionLimpia = partes.length > 0
              ? partes.join(', ')
              : data.display_name.split(',').slice(0, 3).join(',').trim()
            onChange({ direccion: direccionLimpia })
            setSugerencias([])
            setMostrarLista(false)
          }
        } catch {
          setGeoError('No pudimos obtener tu dirección. Escríbela manualmente.')
        } finally {
          setBuscandoGeo(false)
        }
      },
      (err) => {
        setBuscandoGeo(false)
        if (err.code === 1) setGeoError('Permiso denegado. Escribe tu dirección manualmente.')
        else setGeoError('No pudimos ubicarte. Escribe tu dirección manualmente.')
      },
      { timeout: 8000, maximumAge: 60000 }
    )
  }

  const handleDireccionChange = (valor) => {
    onChange({ direccion: valor })
    setGeoError(null)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => buscarDirecciones(valor), 400)
  }

  const seleccionarSugerencia = (s) => {
    const a = s.address || {}
    const partes = [
      a.road,
      a.house_number,
      a.suburb || a.neighbourhood,
      a.city_district || a.county,
      a.city || a.town,
    ].filter(Boolean)
    const dir = partes.length > 0
      ? partes.join(', ')
      : s.display_name.split(',').slice(0, 3).join(',').trim()
    onChange({ direccion: dir })
    setSugerencias([])
    setMostrarLista(false)
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Nombre del negocio */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[#374151] uppercase tracking-wider">
          Nombre de tu negocio <span className="text-red-400">*</span>
        </label>
        <div className={`flex items-center gap-2 px-4 rounded-xl border transition-all bg-[#FAFAFA] ${
          errores.nombre ? 'border-red-400' : 'border-[#E5E7EB] focus-within:border-[#0D9488]'
        }`}>
          <i className="ri-store-2-line text-[#9CA3AF] text-sm shrink-0" />
          <input
            className="flex-1 py-3.5 bg-transparent text-sm text-[#111827] outline-none placeholder-[#9CA3AF]"
            placeholder="Ej: Mi Tienda Peruana"
            value={datos.nombre}
            onChange={e => { onChange({ nombre: e.target.value }); setErrores(p => ({...p, nombre: null})) }}
          />
        </div>
        {errores.nombre && (
          <span className="text-xs text-red-500 flex items-center gap-1">
            <i className="ri-error-warning-line" />{errores.nombre}
          </span>
        )}
      </div>

      {/* Categoría */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[#374151] uppercase tracking-wider">
          Tipo de negocio <span className="text-red-400">*</span>
        </label>
        <div className={`flex items-center gap-2 px-4 rounded-xl border transition-all bg-[#FAFAFA] ${
          errores.categoria ? 'border-red-400' : 'border-[#E5E7EB] focus-within:border-[#0D9488]'
        }`}>
          <i className="ri-price-tag-3-line text-[#9CA3AF] text-sm shrink-0" />
          <select
            className="flex-1 py-3.5 bg-transparent text-sm text-[#111827] outline-none cursor-pointer"
            value={datos.categoria}
            onChange={e => { onChange({ categoria: e.target.value }); setErrores(p => ({...p, categoria: null})) }}
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        {errores.categoria && (
          <span className="text-xs text-red-500 flex items-center gap-1">
            <i className="ri-error-warning-line" />{errores.categoria}
          </span>
        )}
      </div>

      {/* Dirección con geolocalización */}
      <div className="flex flex-col gap-1.5" ref={wrapRef}>
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[#374151] uppercase tracking-wider">
            Dirección o ubicación
          </label>
          <button
            type="button"
            onClick={obtenerUbicacion}
            disabled={buscandoGeo}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#0D9488] hover:text-[#0F766E] transition-colors cursor-pointer disabled:opacity-60"
          >
            {buscandoGeo
              ? <><i className="ri-loader-4-line animate-spin text-sm" /> Ubicando...</>
              : <><i className="ri-map-pin-2-line text-sm" /> Usar mi ubicación</>
            }
          </button>
        </div>

        <div className="relative">
          <div className={`flex items-center gap-2 px-4 rounded-xl border transition-all bg-[#FAFAFA] ${
            mostrarLista ? 'border-[#0D9488] rounded-b-none' : 'border-[#E5E7EB] focus-within:border-[#0D9488]'
          }`}>
            <i className="ri-map-pin-line text-[#9CA3AF] text-sm shrink-0" />
            <input
              className="flex-1 py-3.5 bg-transparent text-sm text-[#111827] outline-none placeholder-[#9CA3AF]"
              placeholder="Escribe o usa tu ubicación actual"
              value={datos.direccion}
              onChange={e => handleDireccionChange(e.target.value)}
              onFocus={() => sugerencias.length > 0 && setMostrarLista(true)}
              autoComplete="off"
            />
            {datos.direccion && (
              <button
                type="button"
                onClick={() => { onChange({ direccion: '' }); setSugerencias([]); setMostrarLista(false) }}
                className="text-[#9CA3AF] hover:text-[#374151] transition-colors cursor-pointer shrink-0"
              >
                <i className="ri-close-line text-sm" />
              </button>
            )}
          </div>

          {/* Dropdown de sugerencias */}
          {mostrarLista && sugerencias.length > 0 && (
            <div className="absolute left-0 right-0 z-20 bg-white border border-[#0D9488] border-t-0 rounded-b-xl shadow-lg overflow-hidden">
              {sugerencias.map((s, i) => {
                const a = s.address || {}
                const linea1 = [a.road, a.house_number].filter(Boolean).join(' ') || s.display_name.split(',')[0]
                const linea2 = [a.suburb || a.neighbourhood, a.city_district, a.city || a.town].filter(Boolean).join(', ')
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => seleccionarSugerencia(s)}
                    className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-[#F0FDF9] transition-colors cursor-pointer border-b border-[#F3F4F6] last:border-0"
                  >
                    <i className="ri-map-pin-line text-[#0D9488] text-sm mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-[#111827] truncate">{linea1}</div>
                      {linea2 && <div className="text-xs text-[#9CA3AF] truncate">{linea2}</div>}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Error de geolocalización */}
        {geoError && (
          <span className="text-xs text-amber-600 flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <i className="ri-map-pin-off-line shrink-0" />{geoError}
          </span>
        )}
      </div>

      {/* Descripción */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[#374151] uppercase tracking-wider">
          Descripción de tu negocio
        </label>
        <div className="flex gap-2 px-4 rounded-xl border border-[#E5E7EB] focus-within:border-[#0D9488] bg-[#FAFAFA] transition-all">
          <i className="ri-file-text-line text-[#9CA3AF] text-sm shrink-0 mt-3.5" />
          <textarea
            className="flex-1 py-3.5 bg-transparent text-sm text-[#111827] outline-none placeholder-[#9CA3AF] resize-none"
            placeholder="Ej: Vendemos comida peruana casera para delivery..."
            rows={3}
            maxLength={500}
            value={datos.descripcion}
            onChange={e => onChange({ descripcion: e.target.value })}
          />
        </div>
        <span className="text-[10px] text-[#9CA3AF] text-right">{datos.descripcion.length}/500</span>
      </div>

      {/* WhatsApp */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[#374151] uppercase tracking-wider">
          WhatsApp del negocio <span className="text-red-400">*</span>
        </label>
        <div className={`flex items-center gap-2 px-4 rounded-xl border transition-all bg-[#FAFAFA] ${
          errores.whatsapp ? 'border-red-400'
          : datos.whatsapp.length === 9 ? 'border-[#0D9488]'
          : 'border-[#E5E7EB] focus-within:border-[#0D9488]'
        }`}>
          <i className="ri-whatsapp-line text-[#9CA3AF] text-sm shrink-0" />
          <span className="text-sm text-[#6B7280] font-semibold shrink-0">+51</span>
          <input
            className="flex-1 py-3.5 bg-transparent text-sm text-[#111827] outline-none placeholder-[#9CA3AF]"
            placeholder="987654321"
            value={datos.whatsapp}
            onChange={e => { onChange({ whatsapp: e.target.value.replace(/\D/g, '') }); setErrores(p => ({...p, whatsapp: null})) }}
            maxLength={9}
            inputMode="numeric"
          />
          <span className={`text-xs shrink-0 ${datos.whatsapp.length === 9 ? 'text-[#0D9488] font-semibold' : 'text-[#9CA3AF]'}`}>
            {datos.whatsapp.length}/9
          </span>
        </div>
        <span className="text-[10px] text-[#9CA3AF]">Solo números, 9 dígitos (Perú)</span>
        {errores.whatsapp && (
          <span className="text-xs text-red-500 flex items-center gap-1">
            <i className="ri-error-warning-line" />{errores.whatsapp}
          </span>
        )}
      </div>

      <button
        onClick={() => { if (validar()) onSiguiente() }}
        className="w-full py-3.5 rounded-xl bg-[#0D9488] text-white font-bold text-sm hover:bg-[#0F766E] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#0D9488]/20 mt-2"
      >
        Continuar <i className="ri-arrow-right-line" />
      </button>
    </div>
  )
}

export default Paso1Negocio
