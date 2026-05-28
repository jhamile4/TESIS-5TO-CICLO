import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginCliente } from '../../services/apiPublico'
import logoCrecio from '../../assets/logoCrecio.png'

function LoginPage() {
  const navigate = useNavigate()
  const [datos, setDatos]       = useState({ email: '', contrasena: '' })
  const [errores, setErrores]   = useState({})
  const [cargando, setCargando] = useState(false)
  const [errorApi, setErrorApi] = useState(null)
  const [verPass, setVerPass]   = useState(false)

  const validar = () => {
    const e = {}
    if (!datos.email.trim())     e.email     = 'El email es obligatorio'
    if (!datos.contrasena.trim()) e.contrasena = 'La contraseña es obligatoria'
    setErrores(e)
    return Object.keys(e).length === 0
  }

  const handleLogin = async () => {
    if (!validar()) return
    setCargando(true)
    setErrorApi(null)
    try {
      const res = await loginCliente(datos.email, datos.contrasena)
      localStorage.setItem('token', res.token)
      localStorage.setItem('cliente', JSON.stringify(res.cliente))
      navigate('/')
    } catch (err) {
      setErrorApi(err.message || 'Email o contraseña incorrectos')
    } finally {
      setCargando(false)
    }
  }

  const campo = (key, label, type, placeholder) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[#374151] uppercase tracking-wider">{label}</label>
      <div className="relative">
        <input
          type={key === 'contrasena' ? (verPass ? 'text' : 'password') : type}
          value={datos[key]}
          placeholder={placeholder}
          onChange={e => { setDatos({ ...datos, [key]: e.target.value }); setErrores({ ...errores, [key]: null }) }}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          className={`w-full px-4 py-3.5 rounded-xl border text-sm text-[#111827] bg-[#FAFAFA] outline-none transition-all
            ${errores[key] ? 'border-red-400 focus:border-red-400' : 'border-[#E5E7EB] focus:border-[#0D9488]'}`}
        />
        {key === 'contrasena' && (
          <button
            type="button"
            onClick={() => setVerPass(!verPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#0D9488] transition-colors cursor-pointer"
          >
            <i className={verPass ? 'ri-eye-off-line' : 'ri-eye-line'} />
          </button>
        )}
      </div>
      {errores[key] && <span className="text-xs text-red-500 flex items-center gap-1"><i className="ri-error-warning-line" />{errores[key]}</span>}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">

      {/* Topbar */}
      <div className="h-16 border-b border-[#E5E7EB] bg-white/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8">
        <button onClick={() => navigate('/')} className="cursor-pointer">
          <img src={logoCrecio} alt="CRECIO" className="h-7 w-auto object-contain" />
        </button>
        <button
          onClick={() => navigate('/')}
          className="text-sm text-[#6B7280] hover:text-[#0D9488] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <i className="ri-arrow-left-line text-sm" />
          Volver al inicio
        </button>
      </div>

      {/* Contenido centrado */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#111827] tracking-tight mb-2">
              Bienvenido de vuelta
            </h1>
            <p className="text-sm text-[#6B7280]">
              Accede a tu panel y gestiona tu negocio
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8 flex flex-col gap-5">

            {campo('email',     'Email',      'email',    'tu@email.com')}
            {campo('contrasena','Contraseña', 'password', 'Tu contraseña')}

            {/* Olvidé contraseña */}
            <div className="text-right -mt-2">
              <button className="text-xs text-[#0D9488] hover:underline font-medium cursor-pointer">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Error API */}
            {errorApi && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                <i className="ri-error-warning-line shrink-0" />
                {errorApi}
              </div>
            )}

            {/* Botón */}
            <button
              onClick={handleLogin}
              disabled={cargando}
              className="w-full py-3.5 rounded-xl bg-[#0D9488] text-white font-bold text-sm hover:bg-[#0F766E] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#0D9488]/20"
            >
              {cargando
                ? <><i className="ri-loader-4-line animate-spin" /> Ingresando...</>
                : <><i className="ri-login-box-line" /> Iniciar sesión</>
              }
            </button>

            {/* Divisor */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#E5E7EB]" />
              <span className="text-xs text-[#9CA3AF]">¿Aún no tienes cuenta?</span>
              <div className="flex-1 h-px bg-[#E5E7EB]" />
            </div>

            {/* Ir a registro */}
            <button
              onClick={() => navigate('/registro')}
              className="w-full py-3.5 rounded-xl border border-[#E5E7EB] text-[#374151] font-semibold text-sm hover:border-[#0D9488] hover:text-[#0D9488] transition-all cursor-pointer"
            >
              Crear mi tienda gratis
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-[#9CA3AF] mt-6">
            © 2026 CRECIO · <a href="#" className="hover:text-[#6B7280]">Privacidad</a> · <a href="#" className="hover:text-[#6B7280]">Términos</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage