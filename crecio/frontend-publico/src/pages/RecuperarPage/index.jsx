import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { solicitarRecuperacion, restablecerPassword } from '../../services/apiPublico'
import logoCrecio from '../../assets/logoCrecio.png'

const inputClase = 'w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] text-sm outline-none focus:border-[#0D9488] transition-colors placeholder-[#9CA3AF]'

function RecuperarPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [paso,      setPaso]      = useState(1)
  const [email,     setEmail]     = useState(searchParams.get('email') || '')
  const [codigo,    setCodigo]    = useState('')
  const [nueva,     setNueva]     = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [verPass,   setVerPass]   = useState(false)
  const [cargando,  setCargando]  = useState(false)
  const [error,     setError]     = useState(null)
  const [aviso,     setAviso]     = useState(null)

  const enviarCodigo = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) { setError('Ingresa un correo válido'); return }
    setCargando(true); setError(null)
    try {
      const data = await solicitarRecuperacion(email.trim())
      setAviso(data.message)
      setPaso(2)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  const cambiar = async () => {
    if (codigo.length !== 6) { setError('El código debe tener 6 dígitos'); return }
    if (nueva.length < 6)    { setError('La contraseña debe tener al menos 6 caracteres'); return }
    if (nueva !== confirmar) { setError('Las contraseñas no coinciden'); return }
    setCargando(true); setError(null)
    try {
      await restablecerPassword(email.trim(), codigo, nueva)
      setPaso(3)
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <div className="h-16 border-b border-[#E5E7EB] bg-white/80 backdrop-blur-md flex items-center px-4 md:px-8">
        <button onClick={() => navigate('/')} className="cursor-pointer">
          <img src={logoCrecio} alt="CRECIO" className="h-7 w-auto object-contain" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">

          {paso === 3 ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#0D9488]/10 flex items-center justify-center mx-auto mb-5">
                <i className="ri-checkbox-circle-line text-[#0D9488] text-3xl" />
              </div>
              <h2 className="text-xl font-bold text-[#111827] mb-2">¡Contraseña actualizada!</h2>
              <p className="text-sm text-[#6B7280]">Ya puedes iniciar sesión con tu nueva contraseña. Redirigiendo...</p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-[#0D9488]/10 flex items-center justify-center mx-auto mb-6">
                <i className={`${paso === 1 ? 'ri-lock-unlock-line' : 'ri-key-2-line'} text-[#0D9488] text-3xl`} />
              </div>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-[#111827] mb-2">
                  {paso === 1 ? 'Recupera tu contraseña' : 'Crea tu nueva contraseña'}
                </h1>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  {paso === 1
                    ? 'Escribe el correo de tu cuenta y te enviaremos un código de 6 dígitos.'
                    : aviso}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {paso === 1 ? (
                  <input type="email" value={email} autoFocus placeholder="tu@correo.com" className={inputClase}
                    onChange={e => { setEmail(e.target.value); setError(null) }}
                    onKeyDown={e => e.key === 'Enter' && enviarCodigo()} />
                ) : (
                  <>
                    <input value={codigo} maxLength={6} inputMode="numeric" autoFocus placeholder="000000"
                      className={`${inputClase} text-center text-2xl font-bold tracking-[0.5em]`}
                      onChange={e => { setCodigo(e.target.value.replace(/\D/g, '')); setError(null) }} />
                    <div className="relative">
                      <input type={verPass ? 'text' : 'password'} value={nueva} placeholder="Nueva contraseña (mínimo 6 caracteres)"
                        className={`${inputClase} pr-10`} onChange={e => { setNueva(e.target.value); setError(null) }} />
                      <button type="button" onClick={() => setVerPass(!verPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#0D9488] cursor-pointer">
                        <i className={verPass ? 'ri-eye-off-line' : 'ri-eye-line'} />
                      </button>
                    </div>
                    <input type={verPass ? 'text' : 'password'} value={confirmar} placeholder="Repite la nueva contraseña"
                      className={inputClase} onChange={e => { setConfirmar(e.target.value); setError(null) }}
                      onKeyDown={e => e.key === 'Enter' && cambiar()} />
                  </>
                )}

                {error && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-3 py-2.5">
                    <i className="ri-error-warning-line shrink-0" />{error}
                  </div>
                )}

                <button onClick={paso === 1 ? enviarCodigo : cambiar} disabled={cargando}
                  className="w-full py-3.5 rounded-xl bg-[#0D9488] text-white font-bold text-sm hover:bg-[#0F766E] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#0D9488]/20">
                  {cargando
                    ? <><i className="ri-loader-4-line animate-spin" /> {paso === 1 ? 'Enviando...' : 'Guardando...'}</>
                    : paso === 1 ? 'Enviar código' : 'Cambiar contraseña'}
                </button>

                {paso === 2 && (
                  <button onClick={enviarCodigo} disabled={cargando}
                    className="text-xs font-semibold text-[#0D9488] hover:underline cursor-pointer">
                    No me llegó el código, enviar otro
                  </button>
                )}

                <button onClick={() => navigate('/login')}
                  className="w-full py-3 rounded-xl border border-[#E5E7EB] text-[#6B7280] font-medium text-sm hover:border-[#0D9488] hover:text-[#0D9488] transition-all cursor-pointer flex items-center justify-center gap-2">
                  <i className="ri-arrow-left-line" /> Volver a iniciar sesión
                </button>
              </div>

              {paso === 2 && (
                <p className="text-center text-xs text-[#9CA3AF] mt-4">Revisa tu carpeta de spam si no encuentras el correo.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecuperarPage
