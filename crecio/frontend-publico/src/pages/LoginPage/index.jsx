import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logoCrecio from '../../assets/logoCrecio.png'

const BASE_URL = 'http://localhost:3001/api'

function LoginPage() {
  const navigate = useNavigate()
  const [datos, setDatos]       = useState({ email: '', contrasena: '' })
  const [errores, setErrores]   = useState({})
  const [cargando, setCargando] = useState(false)
  const [errorApi, setErrorApi] = useState(null)
  const [verPass, setVerPass]   = useState(false)
  const [showRoles, setShowRoles] = useState(false)
  const [datosLogin, setDatosLogin] = useState(null)

  const validar = () => {
    const e = {}
    if (!datos.email.trim())      e.email      = 'El email es obligatorio'
    if (!datos.contrasena.trim()) e.contrasena = 'La contraseña es obligatoria'
    setErrores(e)
    return Object.keys(e).length === 0
  }

  const guardarSesion = (data) => {
    const compradorConRol = { ...data.cliente, esEmprendedor: data.roles?.esEmprendedor ?? false }
    localStorage.setItem('token',           data.token)
    localStorage.setItem('cliente',         JSON.stringify(data.cliente))
    localStorage.setItem('token_comprador', data.token)
    localStorage.setItem('comprador',       JSON.stringify(compradorConRol))
    window.dispatchEvent(new Event('compradorActualizado'))
  }

  const handleLogin = async () => {
    if (!validar()) return
    setCargando(true); setErrorApi(null)
    try {
      const res  = await fetch(`${BASE_URL}/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: datos.email, password: datos.contrasena }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Error al iniciar sesión')

      guardarSesion(data)
      setDatosLogin(data)

      // Decidir a dónde va según sus roles
      if (data.roles.ambos) {
        // Tiene negocio Y puede comprar — mostrar pantalla de elección
        setShowRoles(true)
      } else if (data.roles.esEmprendedor) {
        // Solo emprendedor → panel admin (próximamente)
        navigate('/panel')
      } else {
        // Solo comprador → perfil
        navigate('/perfil')
      }
    } catch (err) {
      setErrorApi(err.message || 'Email o contraseña incorrectos')
    } finally {
      setCargando(false)
    }
  }

  // Pantalla de elección de rol
  if (showRoles && datosLogin) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[#0D9488] flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl font-bold text-white">
                {datosLogin.cliente.nombre?.charAt(0).toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#111827]">
              Hola, {datosLogin.cliente.nombre} 👋
            </h1>
            <p className="text-sm text-[#6B7280] mt-2">
              Tienes cuenta de negocio y de comprador. ¿Cómo quieres ingresar hoy?
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {/* Opción emprendedor */}
            <button
              onClick={() => navigate('/panel')}
              className="group bg-white border-2 border-[#E5E7EB] hover:border-[#0D9488] rounded-2xl p-6 text-left transition-all cursor-pointer hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0D9488]/10 flex items-center justify-center shrink-0 group-hover:bg-[#0D9488]/20 transition-colors">
                  <i className="ri-store-2-line text-[#0D9488] text-2xl" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#111827]">Gestionar mi tienda</h3>
                  <p className="text-sm text-[#6B7280] mt-0.5">Panel de administración de tu negocio</p>
                </div>
                <i className="ri-arrow-right-line text-[#9CA3AF] ml-auto group-hover:text-[#0D9488] transition-colors" />
              </div>
            </button>

            {/* Opción comprador */}
            <button
              onClick={() => navigate('/perfil')}
              className="group bg-white border-2 border-[#E5E7EB] hover:border-[#0D9488] rounded-2xl p-6 text-left transition-all cursor-pointer hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0D9488]/10 flex items-center justify-center shrink-0 group-hover:bg-[#0D9488]/20 transition-colors">
                  <i className="ri-shopping-bag-line text-[#0D9488] text-2xl" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#111827]">Comprar en CRECIO</h3>
                  <p className="text-sm text-[#6B7280] mt-0.5">Ver mis pedidos y explorar tiendas</p>
                </div>
                <i className="ri-arrow-right-line text-[#9CA3AF] ml-auto group-hover:text-[#0D9488] transition-colors" />
              </div>
            </button>
          </div>

          <p className="text-center text-xs text-[#9CA3AF] mt-6">
            Puedes cambiar entre modos cuando quieras
          </p>
        </div>
      </div>
    )
  }

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

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#111827] tracking-tight mb-2">
              Bienvenido de vuelta
            </h1>
            <p className="text-sm text-[#6B7280]">Accede a tu cuenta CRECIO</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8 flex flex-col gap-5">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#374151] uppercase tracking-wider">
                Email <span className="text-red-400">*</span>
              </label>
              <div className={`flex items-center gap-2 px-4 rounded-xl border transition-all bg-[#FAFAFA] ${
                errores.email ? 'border-red-400' : 'border-[#E5E7EB] focus-within:border-[#0D9488]'
              }`}>
                <i className="ri-mail-line text-[#9CA3AF] text-sm shrink-0" />
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={datos.email}
                  onChange={e => { setDatos({ ...datos, email: e.target.value }); setErrores({ ...errores, email: null }) }}
                  className="flex-1 py-3.5 bg-transparent text-sm text-[#111827] outline-none placeholder-[#9CA3AF]"
                />
              </div>
              {errores.email && <span className="text-xs text-red-500 flex items-center gap-1"><i className="ri-error-warning-line" />{errores.email}</span>}
            </div>

            {/* Contraseña */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#374151] uppercase tracking-wider">
                Contraseña <span className="text-red-400">*</span>
              </label>
              <div className={`flex items-center gap-2 px-4 rounded-xl border transition-all bg-[#FAFAFA] ${
                errores.contrasena ? 'border-red-400' : 'border-[#E5E7EB] focus-within:border-[#0D9488]'
              }`}>
                <i className="ri-lock-line text-[#9CA3AF] text-sm shrink-0" />
                <input
                  type={verPass ? 'text' : 'password'}
                  placeholder="Tu contraseña"
                  value={datos.contrasena}
                  onChange={e => { setDatos({ ...datos, contrasena: e.target.value }); setErrores({ ...errores, contrasena: null }) }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  className="flex-1 py-3.5 bg-transparent text-sm text-[#111827] outline-none placeholder-[#9CA3AF]"
                />
                <button
                  type="button"
                  onClick={() => setVerPass(!verPass)}
                  className="text-[#9CA3AF] hover:text-[#0D9488] transition-colors cursor-pointer"
                >
                  <i className={verPass ? 'ri-eye-off-line' : 'ri-eye-line'} />
                </button>
              </div>
              {errores.contrasena && <span className="text-xs text-red-500 flex items-center gap-1"><i className="ri-error-warning-line" />{errores.contrasena}</span>}
            </div>

            {errorApi && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                <i className="ri-error-warning-line shrink-0" />
                {errorApi}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={cargando}
              className="w-full py-3.5 rounded-xl bg-[#0D9488] text-white font-bold text-sm hover:bg-[#0F766E] transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-[#0D9488]/20"
            >
              {cargando
                ? <><i className="ri-loader-4-line animate-spin" /> Ingresando...</>
                : <><i className="ri-login-box-line" /> Iniciar sesión</>
              }
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#E5E7EB]" />
              <span className="text-xs text-[#9CA3AF]">¿Aún no tienes cuenta?</span>
              <div className="flex-1 h-px bg-[#E5E7EB]" />
            </div>

            <button
              onClick={() => navigate('/registro')}
              className="w-full py-3.5 rounded-xl border border-[#E5E7EB] text-[#374151] font-semibold text-sm hover:border-[#0D9488] hover:text-[#0D9488] transition-all cursor-pointer"
            >
              Crear mi tienda gratis
            </button>
          </div>

          <p className="text-center text-xs text-[#9CA3AF] mt-6">
            © 2026 CRECIO ·{' '}
            <a href="#" className="hover:text-[#6B7280]">Privacidad</a> ·{' '}
            <a href="#" className="hover:text-[#6B7280]">Términos</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage