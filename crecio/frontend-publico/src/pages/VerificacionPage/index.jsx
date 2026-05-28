import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { verificarCodigo } from '../../services/apiPublico'
import logoCrecio from '../../assets/logoCrecio.png'

function VerificacionPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''
  const [codigo, setCodigo]     = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError]       = useState(null)
  const [exitoso, setExitoso]   = useState(false)

  const handleVerificar = async () => {
    if (codigo.length !== 6) { setError('El código debe tener 6 dígitos'); return }
    setCargando(true); setError(null)
    try {
      await verificarCodigo(email, codigo)
      setExitoso(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.message || 'Código incorrecto o expirado')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">

      {/* Topbar */}
      <div className="h-16 border-b border-[#E5E7EB] bg-white/80 backdrop-blur-md flex items-center px-4 md:px-8">
        <button onClick={() => navigate('/')} className="cursor-pointer">
          <img src={logoCrecio} alt="CRECIO" className="h-7 w-auto object-contain" />
        </button>
      </div>

      {/* Contenido */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {exitoso ? (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-10 text-center shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[#0D9488]/10 flex items-center justify-center mx-auto mb-5">
                <i className="ri-checkbox-circle-line text-[#0D9488] text-3xl" />
              </div>
              <h2 className="text-xl font-bold text-[#111827] mb-2">¡Correo verificado!</h2>
              <p className="text-sm text-[#6B7280] mb-4">Tu cuenta está activa. Redirigiendo al login...</p>
              <div className="flex items-center justify-center gap-2 text-xs text-[#9CA3AF]">
                <i className="ri-loader-4-line animate-spin" /> Redirigiendo...
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">

              {/* Ícono */}
              <div className="w-16 h-16 rounded-full bg-[#0D9488]/10 flex items-center justify-center mx-auto mb-6">
                <i className="ri-mail-send-line text-[#0D9488] text-3xl" />
              </div>

              <div className="text-center mb-7">
                <h1 className="text-2xl font-bold text-[#111827] mb-2">Verifica tu correo</h1>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  Enviamos un código de 6 dígitos a<br />
                  <strong className="text-[#111827]">{email}</strong>
                </p>
              </div>

              {/* Input código */}
              <div className="flex flex-col gap-2 mb-5">
                <label className="text-xs font-semibold text-[#374151] uppercase tracking-wider text-center">
                  Código de verificación
                </label>
                <input
                  className={`w-full text-center text-3xl font-bold tracking-[0.5em] py-4 px-4 rounded-xl border bg-[#FAFAFA] outline-none transition-all ${
                    error ? 'border-red-400 text-red-500' : 'border-[#E5E7EB] focus:border-[#0D9488] text-[#111827]'
                  }`}
                  placeholder="000000"
                  maxLength={6}
                  value={codigo}
                  onChange={e => { setCodigo(e.target.value.replace(/\D/g, '')); setError(null) }}
                  onKeyDown={e => e.key === 'Enter' && handleVerificar()}
                  inputMode="numeric"
                  autoFocus
                />
                {error && (
                  <span className="text-xs text-red-500 text-center flex items-center justify-center gap-1">
                    <i className="ri-error-warning-line" />{error}
                  </span>
                )}
              </div>

              {/* Botón verificar */}
              <button
                onClick={handleVerificar}
                disabled={cargando || codigo.length !== 6}
                className="w-full py-3.5 rounded-xl bg-[#0D9488] text-white font-bold text-sm hover:bg-[#0F766E] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#0D9488]/20 mb-3"
              >
                {cargando
                  ? <><i className="ri-loader-4-line animate-spin" /> Verificando...</>
                  : <><i className="ri-shield-check-line" /> Verificar cuenta</>
                }
              </button>

              {/* Volver */}
              <button
                onClick={() => navigate('/registro')}
                className="w-full py-3 rounded-xl border border-[#E5E7EB] text-[#6B7280] font-medium text-sm hover:border-[#0D9488] hover:text-[#0D9488] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <i className="ri-arrow-left-line" /> Volver al registro
              </button>

              <p className="text-center text-xs text-[#9CA3AF] mt-4">
                Revisa tu carpeta de spam si no encuentras el correo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VerificacionPage
