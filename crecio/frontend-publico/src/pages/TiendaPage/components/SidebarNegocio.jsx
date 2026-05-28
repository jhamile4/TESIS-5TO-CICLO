import MapaNegocio from './MapaNegocio'

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
            <span className="text-sm font-bold text-[#0D9488]">S/ {subtotal}.00</span>
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
                <div className="text-[#374151] text-xs">{negocio.direccion}</div>
              </div>
            </div>
          )}
        </div>

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
            <div className="text-xs font-bold text-[#0F766E]">Negocio verificado</div>
            <div className="text-[10px] text-[#6B7280]">Pasó nuestro proceso de verificación</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SidebarNegocio