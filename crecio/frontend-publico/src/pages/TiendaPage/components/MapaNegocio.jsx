function MapaNegocio({ negocio }) {
  const lat = Number(negocio?.latitud)
  const lon = Number(negocio?.longitud)

  if (!lat || !lon) return null

  const embedUrl = `https://www.google.com/maps?q=${lat},${lon}&output=embed&z=16`

  return (
    <div className="mt-4">
      <h3 className="text-sm font-bold text-[#111827] mb-3 flex items-center gap-2">
        <i className="ri-map-pin-line text-[#0D9488]" />
        Ubicación
      </h3>
      <div className="rounded-2xl overflow-hidden border border-[#E5E7EB]" style={{ height: '220px' }}>
        <iframe
          title="Ubicación del negocio"
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      {negocio.direccion && (
        <div className="flex items-start gap-2 mt-2 text-xs text-[#6B7280]">
          <i className="ri-map-pin-line text-[#0D9488] mt-0.5 shrink-0" />
          <span>{negocio.direccion}</span>
        </div>
      )}
    </div>
  )
}

export default MapaNegocio