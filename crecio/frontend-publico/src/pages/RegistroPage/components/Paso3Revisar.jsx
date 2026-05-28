function Fila({ label, valor }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-[#F3F4F6] last:border-0">
      <span className="text-xs text-[#9CA3AF] font-medium shrink-0 w-24">{label}</span>
      <span className="text-sm text-[#111827] font-medium text-right">
        {valor || <span className="text-[#9CA3AF] font-normal italic">No especificado</span>}
      </span>
    </div>
  )
}

function Paso3Revisar({ datos, onAtras, onEnviar, enviando, error }) {
  return (
    <div className="flex flex-col gap-5">

      {/* Card negocio */}
      <div className="rounded-xl border border-[#E5E7EB] overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-[#FAFAFA] border-b border-[#E5E7EB]">
          <i className="ri-store-2-line text-[#0D9488] text-sm" />
          <span className="text-xs font-bold text-[#374151] uppercase tracking-wider">Datos de tu negocio</span>
        </div>
        <div className="px-4 py-1">
          <Fila label="Nombre"     valor={datos.nombre} />
          <Fila label="Categoría"  valor={datos.categoria} />
          <Fila label="WhatsApp"   valor={datos.whatsapp ? `+51 ${datos.whatsapp}` : ''} />
          <Fila label="Dirección"  valor={datos.direccion} />
          {datos.descripcion && <Fila label="Descripción" valor={datos.descripcion} />}
        </div>
      </div>

      {/* Card cuenta */}
      <div className="rounded-xl border border-[#E5E7EB] overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-[#FAFAFA] border-b border-[#E5E7EB]">
          <i className="ri-user-line text-[#0D9488] text-sm" />
          <span className="text-xs font-bold text-[#374151] uppercase tracking-wider">Tu cuenta</span>
        </div>
        <div className="px-4 py-1">
          <Fila label="Nombre"     valor={datos.nombreCompleto} />
          <div className="flex items-start justify-between gap-4 py-2.5 border-b border-[#F3F4F6]">
            <span className="text-xs text-[#9CA3AF] font-medium shrink-0 w-24">Email</span>
            <span className="text-sm text-[#111827] font-medium text-right flex items-center gap-1.5">
              {datos.email}
              <i className="ri-checkbox-circle-fill text-[#0D9488] text-sm" />
            </span>
          </div>
          <div className="flex items-start justify-between gap-4 py-2.5">
            <span className="text-xs text-[#9CA3AF] font-medium shrink-0 w-24">Contraseña</span>
            <span className="text-sm text-[#111827] font-medium tracking-widest">{'•'.repeat(datos.contrasena.length)}</span>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          <i className="ri-error-warning-line shrink-0" />{error}
        </div>
      )}

      {/* Términos */}
      <p className="text-xs text-[#9CA3AF] text-center leading-relaxed">
        Al enviar aceptas nuestros{' '}
        <a href="#" className="text-[#0D9488] hover:underline">Términos de Servicio</a>
        {' '}y{' '}
        <a href="#" className="text-[#0D9488] hover:underline">Política de Privacidad</a>.
      </p>

      {/* Botones */}
      <div className="flex gap-3">
        <button
          onClick={onAtras}
          disabled={enviando}
          className="flex-1 py-3.5 rounded-xl border border-[#E5E7EB] text-[#374151] font-semibold text-sm hover:border-[#0D9488] hover:text-[#0D9488] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <i className="ri-arrow-left-line" /> Atrás
        </button>
        <button
          onClick={onEnviar}
          disabled={enviando}
          className="flex-1 py-3.5 rounded-xl bg-[#0D9488] text-white font-bold text-sm hover:bg-[#0F766E] transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-[#0D9488]/20"
        >
          {enviando
            ? <><i className="ri-loader-4-line animate-spin" /> Enviando...</>
            : <><i className="ri-send-plane-line" /> Enviar solicitud</>
          }
        </button>
      </div>
    </div>
  )
}

export default Paso3Revisar
