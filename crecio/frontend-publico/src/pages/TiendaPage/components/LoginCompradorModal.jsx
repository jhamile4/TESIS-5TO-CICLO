import { useState } from 'react'

const BASE_URL = 'http://localhost:3001/api'

const post = async (path, body) => {
  const res  = await fetch(`${BASE_URL}${path}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error')
  return data
}

// ── Pantalla 1: Registro ──
function PantallaRegistro({ onIrLogin, onRegistroExitoso }) {
  const [datos, setDatos]       = useState({ nombre: '', email: '', contrasena: '' })
  const [verPass, setVerPass]   = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError]       = useState(null)

  const handleRegistro = async () => {
    if (!datos.nombre || !datos.email || !datos.contrasena) { setError('Completa todos los campos'); return }
    if (datos.contrasena.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }
    setCargando(true); setError(null)
    try {
      await post('/auth/registro-comprador', datos)
      onRegistroExitoso(datos.email)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center mb-2">
        <div className="w-14 h-14 rounded-full bg-[#0D9488]/10 flex items-center justify-center mx-auto mb-3">
          <i className="ri-user-add-line text-[#0D9488] text-2xl" />
        </div>
        <h2 className="text-lg font-bold text-[#111827]">Crear tu cuenta</h2>
        <p className="text-xs text-[#6B7280] mt-1">Para pagar con tarjeta necesitas una cuenta CRECIO</p>
      </div>

      <input
        type="text"
        placeholder="Tu nombre completo"
        value={datos.nombre}
        onChange={e => { setDatos({ ...datos, nombre: e.target.value }); setError(null) }}
        className="w-full px-4 py-3.5 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] text-sm text-[#111827] outline-none focus:border-[#0D9488] transition-colors placeholder-[#9CA3AF]"
      />

      <input
        type="email"
        placeholder="Tu Gmail o correo"
        value={datos.email}
        onChange={e => { setDatos({ ...datos, email: e.target.value }); setError(null) }}
        className="w-full px-4 py-3.5 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] text-sm text-[#111827] outline-none focus:border-[#0D9488] transition-colors placeholder-[#9CA3AF]"
      />

      <div className="relative">
        <input
          type={verPass ? 'text' : 'password'}
          placeholder="Contraseña (mínimo 6 caracteres)"
          value={datos.contrasena}
          onChange={e => { setDatos({ ...datos, contrasena: e.target.value }); setError(null) }}
          onKeyDown={e => e.key === 'Enter' && handleRegistro()}
          className="w-full px-4 py-3.5 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] text-sm text-[#111827] outline-none focus:border-[#0D9488] transition-colors placeholder-[#9CA3AF]"
        />
        <button
          type="button"
          onClick={() => setVerPass(!verPass)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#0D9488] cursor-pointer"
        >
          <i className={verPass ? 'ri-eye-off-line' : 'ri-eye-line'} />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-3 py-2.5">
          <i className="ri-error-warning-line shrink-0" />
          {error}
        </div>
      )}

      <button
        onClick={handleRegistro}
        disabled={cargando}
        className="w-full py-3.5 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold text-sm transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {cargando
          ? <><i className="ri-loader-4-line animate-spin" /> Registrando...</>
          : <><i className="ri-mail-send-line" /> Registrarme y recibir código</>
        }
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#E5E7EB]" />
        <span className="text-xs text-[#9CA3AF]">¿Ya tienes cuenta?</span>
        <div className="flex-1 h-px bg-[#E5E7EB]" />
      </div>

      <button
        onClick={onIrLogin}
        className="w-full py-3 rounded-xl border border-[#E5E7EB] text-[#374151] font-semibold text-sm hover:border-[#0D9488] hover:text-[#0D9488] transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <i className="ri-login-box-line" />
        Iniciar sesión
      </button>
    </div>
  )
}

// ── Pantalla 2: Código de verificación ──
function PantallaVerificacion({ email, onVerificado }) {
  const [codigo, setCodigo]     = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError]       = useState(null)
  const [reenviando, setReenviando] = useState(false)
  const [reenviado, setReenviado]   = useState(false)

  const handleVerificar = async () => {
    if (codigo.length !== 6) { setError('El código debe tener 6 dígitos'); return }
    setCargando(true); setError(null)
    try {
      await post('/auth/verificar-comprador', { email, codigo })
      onVerificado()
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  const handleReenviar = async () => {
    setReenviando(true)
    try {
      await post('/auth/reenviar-codigo', { email })
      setReenviado(true)
      setTimeout(() => setReenviado(false), 5000)
    } catch {}
    finally { setReenviando(false) }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center mb-2">
        <div className="w-14 h-14 rounded-full bg-[#0D9488]/10 flex items-center justify-center mx-auto mb-3">
          <i className="ri-mail-check-line text-[#0D9488] text-2xl" />
        </div>
        <h2 className="text-lg font-bold text-[#111827]">Verifica tu correo</h2>
        <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
          Enviamos un código de 6 dígitos a<br />
          <strong className="text-[#111827]">{email}</strong>
        </p>
      </div>

      {/* Input código grande */}
      <input
        type="text"
        placeholder="000000"
        maxLength={6}
        value={codigo}
        onChange={e => { setCodigo(e.target.value.replace(/\D/g, '')); setError(null) }}
        onKeyDown={e => e.key === 'Enter' && handleVerificar()}
        inputMode="numeric"
        autoFocus
        className={`w-full text-center text-3xl font-bold tracking-[0.5em] py-4 px-4 rounded-xl border bg-[#FAFAFA] outline-none transition-all ${
          error ? 'border-red-400 text-red-500' : 'border-[#E5E7EB] focus:border-[#0D9488] text-[#111827]'
        }`}
      />

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-3 py-2.5">
          <i className="ri-error-warning-line shrink-0" />
          {error}
        </div>
      )}

      {reenviado && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 text-xs rounded-xl px-3 py-2.5">
          <i className="ri-checkbox-circle-line shrink-0" />
          Código reenviado a tu correo
        </div>
      )}

      <button
        onClick={handleVerificar}
        disabled={cargando || codigo.length !== 6}
        className="w-full py-3.5 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold text-sm transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {cargando
          ? <><i className="ri-loader-4-line animate-spin" /> Verificando...</>
          : <><i className="ri-shield-check-line" /> Verificar código</>
        }
      </button>

      <button
        onClick={handleReenviar}
        disabled={reenviando}
        className="text-xs text-[#9CA3AF] hover:text-[#0D9488] transition-colors cursor-pointer text-center"
      >
        {reenviando ? 'Reenviando...' : '¿No llegó? Reenviar código'}
      </button>
    </div>
  )
}

// ── Pantalla 3: Login ──
function PantallaLogin({ emailPrelleno, onLoginExitoso, onIrRegistro }) {
  const [datos, setDatos]       = useState({ email: emailPrelleno || '', contrasena: '' })
  const [verPass, setVerPass]   = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError]       = useState(null)

  const handleLogin = async () => {
    if (!datos.email || !datos.contrasena) { setError('Completa todos los campos'); return }
    setCargando(true); setError(null)
    try {
      const res = await post('/auth/login', { email: datos.email, password: datos.contrasena })
      localStorage.setItem('token_comprador', res.token)
      localStorage.setItem('comprador', JSON.stringify(res.cliente))
      onLoginExitoso(res)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center mb-2">
        <div className="w-14 h-14 rounded-full bg-[#0D9488]/10 flex items-center justify-center mx-auto mb-3">
          <i className="ri-login-box-line text-[#0D9488] text-2xl" />
        </div>
        <h2 className="text-lg font-bold text-[#111827]">Iniciar sesión</h2>
        <p className="text-xs text-[#6B7280] mt-1">Ingresa para continuar con tu pago</p>
      </div>

      {/* Badge ya registrado */}
      {emailPrelleno && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl px-3 py-2.5">
          <i className="ri-checkbox-circle-line shrink-0" />
          ¡Cuenta verificada! Ahora inicia sesión para continuar.
        </div>
      )}

      <input
        type="email"
        placeholder="Tu correo"
        value={datos.email}
        onChange={e => { setDatos({ ...datos, email: e.target.value }); setError(null) }}
        className="w-full px-4 py-3.5 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] text-sm text-[#111827] outline-none focus:border-[#0D9488] transition-colors placeholder-[#9CA3AF]"
      />

      <div className="relative">
        <input
          type={verPass ? 'text' : 'password'}
          placeholder="Tu contraseña"
          value={datos.contrasena}
          onChange={e => { setDatos({ ...datos, contrasena: e.target.value }); setError(null) }}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          className="w-full px-4 py-3.5 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] text-sm text-[#111827] outline-none focus:border-[#0D9488] transition-colors placeholder-[#9CA3AF]"
          autoFocus={!!emailPrelleno}
        />
        <button
          type="button"
          onClick={() => setVerPass(!verPass)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#0D9488] cursor-pointer"
        >
          <i className={verPass ? 'ri-eye-off-line' : 'ri-eye-line'} />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-3 py-2.5">
          <i className="ri-error-warning-line shrink-0" />
          {error}
        </div>
      )}

      <button
        onClick={handleLogin}
        disabled={cargando}
        className="w-full py-3.5 rounded-xl bg-[#111827] hover:bg-[#374151] text-white font-bold text-sm transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {cargando
          ? <><i className="ri-loader-4-line animate-spin" /> Ingresando...</>
          : <><i className="ri-login-box-line" /> Ingresar</>
        }
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#E5E7EB]" />
        <span className="text-xs text-[#9CA3AF]">¿No tienes cuenta?</span>
        <div className="flex-1 h-px bg-[#E5E7EB]" />
      </div>

      <button
        onClick={onIrRegistro}
        className="w-full py-3 rounded-xl border border-[#E5E7EB] text-[#374151] font-semibold text-sm hover:border-[#0D9488] hover:text-[#0D9488] transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <i className="ri-user-add-line" />
        Crear cuenta nueva
      </button>
    </div>
  )
}

// ── Modal principal con 3 pantallas ──
function LoginCompradorModal({ onClose, onSuccess }) {
  const [pantalla, setPantalla]       = useState('registro') // 'registro' | 'codigo' | 'login'
  const [emailRegistrado, setEmailRegistrado] = useState('')

  const handleRegistroExitoso = (email) => {
    setEmailRegistrado(email)
    setPantalla('codigo')
  }

  const handleVerificado = () => {
    setPantalla('login')
  }

  const handleLoginExitoso = (res) => {
    // Recargar navbar con el avatar
    window.dispatchEvent(new Event('compradorActualizado'))
    onSuccess(res)
  }

  const titulos = {
    registro: 'Paso 1 de 3',
    codigo:   'Paso 2 de 3',
    login:    'Paso 3 de 3',
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden"
        style={{ animation: 'modalIn 0.3s cubic-bezier(0.16,1,0.3,1)' }}
      >
        {/* Header con steps */}
        <div className="px-6 pt-5 pb-0">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">
              {titulos[pantalla]}
            </span>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#F3F4F6] transition-colors cursor-pointer"
            >
              <i className="ri-close-line text-[#9CA3AF] text-sm" />
            </button>
          </div>

          {/* Barra de progreso */}
          <div className="flex gap-1.5 mb-5">
            {['registro', 'codigo', 'login'].map((p, i) => (
              <div
                key={p}
                className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                  pantalla === 'registro' && i === 0 ? 'bg-[#0D9488]' :
                  pantalla === 'codigo'   && i <= 1  ? 'bg-[#0D9488]' :
                  pantalla === 'login'               ? 'bg-[#0D9488]' :
                  'bg-[#E5E7EB]'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="px-6 pb-6">
          {pantalla === 'registro' && (
            <PantallaRegistro
              onIrLogin={() => setPantalla('login')}
              onRegistroExitoso={handleRegistroExitoso}
            />
          )}
          {pantalla === 'codigo' && (
            <PantallaVerificacion
              email={emailRegistrado}
              onVerificado={handleVerificado}
            />
          )}
          {pantalla === 'login' && (
            <PantallaLogin
              emailPrelleno={emailRegistrado}
              onLoginExitoso={handleLoginExitoso}
              onIrRegistro={() => setPantalla('registro')}
            />
          )}
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default LoginCompradorModal