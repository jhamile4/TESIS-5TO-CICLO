import { useState } from 'react'

const validarEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
const validarPass  = (p) => p.length >= 8 && /\d/.test(p) && /[a-zA-Z]/.test(p)

function Paso2Cuenta({ datos, onChange, onAtras, onSiguiente }) {
  const [errores, setErrores] = useState({})
  const [verPass, setVerPass] = useState(false)

  const fortaleza = () => {
    if (!datos.contrasena) return null
    if (datos.contrasena.length < 6) return 'debil'
    if (!validarPass(datos.contrasena)) return 'media'
    return 'fuerte'
  }
  const f = fortaleza()

  const validar = () => {
    const e = {}
    if (!datos.nombreCompleto.trim() || datos.nombreCompleto.trim().length < 3)
      e.nombreCompleto = 'Ingresa tu nombre completo (mín. 3 caracteres)'
    if (!datos.email.trim()) e.email = 'El email es obligatorio'
    else if (!validarEmail(datos.email)) e.email = 'Ingresa un email válido'
    if (!datos.contrasena) e.contrasena = 'La contraseña es obligatoria'
    else if (!validarPass(datos.contrasena)) e.contrasena = 'Mínimo 8 caracteres con letras y números'
    setErrores(e)
    return Object.keys(e).length === 0
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Campo: Nombre completo */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[#374151] uppercase tracking-wider">
          Tu nombre completo <span className="text-red-400">*</span>
        </label>
        <div className={`flex items-center gap-2 px-4 rounded-xl border transition-all bg-[#FAFAFA] ${
          errores.nombreCompleto ? 'border-red-400' : 'border-[#E5E7EB] focus-within:border-[#0D9488]'
        }`}>
          <i className="ri-user-line text-[#9CA3AF] text-sm shrink-0" />
          <input
            className="flex-1 py-3.5 bg-transparent text-sm text-[#111827] outline-none placeholder-[#9CA3AF]"
            type="text"
            placeholder="Ej: Juan Pérez García"
            value={datos.nombreCompleto}
            onChange={e => {
              onChange({ nombreCompleto: e.target.value })
              setErrores(p => ({ ...p, nombreCompleto: null }))
            }}
          />
        </div>
        {errores.nombreCompleto && (
          <span className="text-xs text-red-500 flex items-center gap-1">
            <i className="ri-error-warning-line" />{errores.nombreCompleto}
          </span>
        )}
      </div>

      {/* Campo: Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[#374151] uppercase tracking-wider">
          Email <span className="text-red-400">*</span>
        </label>
        <div className={`flex items-center gap-2 px-4 rounded-xl border transition-all bg-[#FAFAFA] ${
          errores.email ? 'border-red-400' : 'border-[#E5E7EB] focus-within:border-[#0D9488]'
        }`}>
          <i className="ri-mail-line text-[#9CA3AF] text-sm shrink-0" />
          <input
            className="flex-1 py-3.5 bg-transparent text-sm text-[#111827] outline-none placeholder-[#9CA3AF]"
            type="email"
            placeholder="tu@email.com"
            value={datos.email}
            onChange={e => {
              onChange({ email: e.target.value })
              setErrores(p => ({ ...p, email: null }))
            }}
          />
          {datos.email && validarEmail(datos.email) && (
            <i className="ri-checkbox-circle-fill text-[#0D9488] text-sm shrink-0" />
          )}
        </div>
        {errores.email && (
          <span className="text-xs text-red-500 flex items-center gap-1">
            <i className="ri-error-warning-line" />{errores.email}
          </span>
        )}
      </div>

      {/* Campo: Contraseña */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[#374151] uppercase tracking-wider">
          Contraseña <span className="text-red-400">*</span>
        </label>
        <div className={`flex items-center gap-2 px-4 rounded-xl border transition-all bg-[#FAFAFA] ${
          errores.contrasena ? 'border-red-400' : 'border-[#E5E7EB] focus-within:border-[#0D9488]'
        }`}>
          <i className="ri-lock-line text-[#9CA3AF] text-sm shrink-0" />
          <input
            className="flex-1 py-3.5 bg-transparent text-sm text-[#111827] outline-none placeholder-[#9CA3AF]"
            type={verPass ? 'text' : 'password'}
            placeholder="Mínimo 8 caracteres con letras y números"
            value={datos.contrasena}
            onChange={e => {
              onChange({ contrasena: e.target.value })
              setErrores(p => ({ ...p, contrasena: null }))
            }}
          />
          <button
            type="button"
            onClick={() => setVerPass(v => !v)}
            className="cursor-pointer text-[#9CA3AF] hover:text-[#0D9488] transition-colors shrink-0"
          >
            <i className={verPass ? 'ri-eye-off-line' : 'ri-eye-line'} />
          </button>
        </div>

        {/* Barra de fortaleza */}
        {datos.contrasena && (
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${
                f === 'debil' ? 'w-1/3 bg-red-400' :
                f === 'media' ? 'w-2/3 bg-amber-400' :
                'w-full bg-[#0D9488]'
              }`} />
            </div>
            <span className={`text-[10px] font-semibold shrink-0 ${
              f === 'debil' ? 'text-red-400' :
              f === 'media' ? 'text-amber-500' :
              'text-[#0D9488]'
            }`}>
              {f === 'debil' ? 'Débil' : f === 'media' ? 'Media' : 'Fuerte ✓'}
            </span>
          </div>
        )}

        {errores.contrasena && (
          <span className="text-xs text-red-500 flex items-center gap-1">
            <i className="ri-error-warning-line" />{errores.contrasena}
          </span>
        )}
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onAtras}
          className="flex-1 py-3.5 rounded-xl border border-[#E5E7EB] text-[#374151] font-semibold text-sm hover:border-[#0D9488] hover:text-[#0D9488] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <i className="ri-arrow-left-line" /> Atrás
        </button>
        <button
          onClick={() => { if (validar()) onSiguiente() }}
          className="flex-1 py-3.5 rounded-xl bg-[#0D9488] text-white font-bold text-sm hover:bg-[#0F766E] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#0D9488]/20"
        >
          Revisar <i className="ri-arrow-right-line" />
        </button>
      </div>
    </div>
  )
}

export default Paso2Cuenta
