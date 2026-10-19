import MapaNegocio from './MapaNegocio'

// Convierte "@usuario" o "instagram.com/usuario" en un enlace válido
const REDES = {
  instagram: ['ri-instagram-line', 'Instagram', (u) => `https://instagram.com/${u}`],
  facebook:  ['ri-facebook-circle-line', 'Facebook', (u) => `https://facebook.com/${u}`],
  tiktok:    ['ri-tiktok-line', 'TikTok', (u) => `https://tiktok.com/@${u}`],
  youtube:   ['ri-youtube-line', 'YouTube', (u) => `https://youtube.com/@${u}`],
  twitter:   ['ri-twitter-x-line', 'X', (u) => `https://x.com/${u}`],
}
const enlaceRed = (clave, valor) => {
  const v = valor.trim()
  if (/^https?:\/\//i.test(v)) return v
  if (/\.(com|pe)\//i.test(v)) return `https://${v.replace(/^\/+/, '')}`
  return REDES[clave][2](v.replace(/^@/, ''))
}

function SidebarNegocio({ negocio, totalItems, subtotal, onAbrirCarrito, onWhatsApp }) {
  return (
    <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">

      {/* Card CTA */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col gap-3">
        <h4 className="font-bold text-[#111827] text-sm">¿Te interesa algo?</h4>
        <p className="text-xs text-[#6B7280] leading-relaxed">
          Agrega productos al carrito o contáctanos directo por WhatsApp.
        </p>

        {totalItems > 0 && (
          <div className="flex items-center justify-between bg-[#F0FDF9] border border-[#99F6E4] rounded-xl px-4 py-3">
            <span className="text-xs font-semibold text-[#0F766E]">
              <i className="ri-shopping-cart-2-line mr-1" />{totalItems} producto(s)
            </span>
            <span className="text-sm font-bold text-[#0D9488]">S/ {Number(subtotal).toFixed(2)}</span>
          </div>
        )}

        <button
          onClick={onWhatsApp}
          className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#22C55E] text-white font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <i className="ri-whatsapp-line text-base" />
          Escribir por WhatsApp
        </button>

        {totalItems > 0 && (
          <button
            onClick={onAbrirCarrito}
            className="w-full py-3 rounded-xl border border-[#0D9488] text-[#0D9488] font-bold text-sm hover:bg-[#0D9488]/5 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <i className="ri-shopping-cart-2-line" />
            Ver carrito ({totalItems})
          </button>
        )}
      </div>

      {/* Info negocio */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col gap-3">
        <h4 className="font-bold text-[#111827] text-sm">Información</h4>
        <div className="flex flex-col gap-2.5">
          {negocio.horario && (
            <div className="flex items-start gap-3">
              <i className="ri-time-line text-[#0D9488] mt-0.5 shrink-0" />
              <div>
                <div className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-0.5">Horario</div>
                <div className="text-[#374151] text-xs">{negocio.horario}</div>
              </div>
            </div>
          )}
          {negocio.telefono && (
            <div className="flex items-start gap-3">
              <i className="ri-phone-line text-[#0D9488] mt-0.5 shrink-0" />
              <div>
                <div className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-0.5">Teléfono</div>
                <div className="text-[#374151] text-xs">{negocio.telefono}</div>
              </div>
            </div>
          )}
          {negocio.direccion && (
            <div className="flex items-start gap-3">
              <i className="ri-map-pin-line text-[#0D9488] mt-0.5 shrink-0" />
              <div>
                <div className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-0.5">Dirección</div>
                <div className="text-[#374151] text-xs">{[negocio.direccion, negocio.distrito].filter(Boolean).join(', ')}</div>
              </div>
            </div>
          )}
          {negocio.email && (
            <div className="flex items-start gap-3">
              <i className="ri-mail-line text-[#0D9488] mt-0.5 shrink-0" />
              <div>
                <div className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-0.5">Email</div>
                <a href={`mailto:${negocio.email}`} className="text-[#374151] text-xs hover:text-[#0D9488] break-all">{negocio.email}</a>
              </div>
            </div>
          )}
        </div>

        {/* Redes sociales que el dueño completó en su panel */}
        {Object.entries(negocio.redes || {}).some(([clave, valor]) => REDES[clave] && valor?.trim()) && (
          <div className="flex flex-wrap gap-2 pt-1">
            {Object.entries(negocio.redes).filter(([clave, valor]) => REDES[clave] && valor?.trim()).map(([clave, valor]) => (
              <a key={clave} href={enlaceRed(clave, valor)} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E5E7EB] text-xs font-semibold text-[#374151] hover:border-[#0D9488] hover:text-[#0D9488] transition-colors">
                <i className={REDES[clave][0]} /> {REDES[clave][1]}
              </a>
            ))}
          </div>
        )}

        {/* Mapa integrado en el sidebar */}
        <MapaNegocio negocio={negocio} />
      </div>

      {/* Verificado */}
      {negocio.verificado && (
        <div className="bg-[#F0FDF9] border border-[#99F6E4] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-[#0D9488]/15 rounded-full flex items-center justify-center shrink-0">
            <i className="ri-shield-check-line text-[#0D9488] text-base" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#0F766E]">Correo del dueño verificado</div>
            <div className="text-[10px] text-[#6B7280]">El dueño confirmó su correo al registrarse en CRECIO</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SidebarNegocio