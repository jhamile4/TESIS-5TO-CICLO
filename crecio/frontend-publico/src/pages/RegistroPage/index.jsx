import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../components/Navbar/Navbar.css'
import StepIndicator from './components/StepIndicator'
import Paso1Negocio from './components/Paso1Negocio'
import Paso2Cuenta from './components/Paso2Cuenta'
import Paso3Revisar from './components/Paso3Revisar'
import { registrarNegocio } from '../../services/apiPublico'

function RegistroPage() {
  const navigate  = useNavigate()
  const [paso, setPaso]       = useState(1)
  const [enviando, setEnviando] = useState(false)
  const [error, setError]     = useState(null)
  const [exitoso, setExitoso] = useState(false)
  const [datos, setDatos]     = useState({
    nombre: '', categoria: '', direccion: '', descripcion: '',
    whatsapp: '', nombreCompleto: '', email: '', contrasena: '',
  })

  const actualizarDatos = (nuevos) => setDatos(prev => ({ ...prev, ...nuevos }))

  const handleEnviar = async () => {
    setEnviando(true)
    setError(null)
    try {
      await registrarNegocio(datos)
      setExitoso(true)
      setTimeout(() => navigate('/verificar?email=' + encodeURIComponent(datos.email)), 1800)
    } catch (err) {
      setError(err.message || 'Ocurrió un error. Intenta nuevamente.')
    } finally {
      setEnviando(false)
    }
  }

  /* ── Pantalla de éxito ── */
  if (exitoso) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-10 max-w-sm w-full text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#0D9488]/10 flex items-center justify-center mx-auto mb-5">
            <i className="ri-checkbox-circle-line text-[#0D9488] text-3xl" />
          </div>
          <h2 className="text-xl font-bold text-[#111827] mb-2">¡Registro enviado!</h2>
          <p className="text-sm text-[#6B7280] mb-6">
            Revisa tu correo <strong>{datos.email}</strong> — te enviamos un código para verificar tu cuenta.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-[#9CA3AF]">
            <i className="ri-loader-4-line animate-spin" />
            Redirigiendo a verificación...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col relative overflow-hidden" style={{
      backgroundImage: `radial-gradient(rgba(13, 148, 136, 0.04) 1.5px, transparent 1.5px)`,
      backgroundSize: '24px 24px'
    }}>
      {/* Top spotlight glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#0D9488]/5 to-transparent rounded-full blur-[100px] pointer-events-none" />

      {/* Topbar */}
      <div className="sticky top-0 z-50 h-16 border-b border-[#E5E7EB] bg-white/70 backdrop-blur-lg flex items-center justify-between px-4 md:px-8 shadow-sm shadow-[#E5E7EB]/10">
        <div 
          className="logo-container-group flex items-center gap-3.5 cursor-pointer select-none relative" 
          onClick={() => navigate('/')}
        >
          {/* 3D Holographic Growth Bars Icon */}
          <div className="w-6 h-6 relative perspective-sm shrink-0 flex items-end gap-[3px] pb-[1px]">
            <div className="logo-prism-wrapper w-full h-full relative transform-style-3d">
              {/* Back Face (Translucent Teal Glass Bars) */}
              <div className="logo-bars-back">
                <div className="logo-bar-back-1" />
                <div className="logo-bar-back-2" />
                <div className="logo-bar-back-3" />
              </div>
              {/* Front Face (Glowing Teal Gradient Bars) */}
              <div className="logo-bars-front">
                <div className="logo-bar-front-1" />
                <div className="logo-bar-front-2" />
                <div className="logo-bar-front-3" />
              </div>
            </div>
          </div>
          
          {/* Bold custom logo text with 3D slot-machine rise */}
          <div className="logo-text-holder flex items-center h-7 select-none">
            <span className="logo-word flex items-center tracking-tighter">
              <span className="logo-char-wrapper">
                <span className="logo-char-3d text-[#111827]">C</span>
              </span>
              <span className="logo-char-wrapper">
                <span className="logo-char-3d text-[#111827]">R</span>
              </span>
              <span className="logo-char-wrapper">
                <span className="logo-char-3d text-[#111827]">E</span>
              </span>
              <span className="logo-char-wrapper">
                <span className="logo-char-3d text-[#0D9488]">C</span>
              </span>
              <span className="logo-char-wrapper">
                <span className="logo-char-3d text-[#0D9488]">I</span>
              </span>
              <span className="logo-char-wrapper">
                <span className="logo-char-3d text-[#0D9488]">O</span>
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-xs md:text-sm text-[#6B7280] hover:text-[#0D9488] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <i className="ri-arrow-left-line text-sm" />
            Volver
          </button>
          <button
            onClick={() => navigate('/login')}
            className="text-xs md:text-sm text-[#374151] hover:text-[#0D9488] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer bg-white px-4 py-2 border border-[#E5E7EB] rounded-xl hover:border-[#0D9488]/30 shadow-sm"
          >
            <span>Iniciar sesión</span>
            <i className="ri-arrow-right-line" />
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-lg">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#111827] tracking-tight mb-2">
              Registra tu negocio
            </h1>
            <p className="text-sm text-[#6B7280]">
              Completa los datos para crear tu tienda digital en CRECIO
            </p>
          </div>

          {/* Steps */}
          <StepIndicator paso={paso} />

          {/* Card del paso */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[#E5E7EB] shadow-xl shadow-teal-950/[0.02] p-7 md:p-8 relative z-10">

            {/* Título del paso */}
            <div className="mb-6 pb-4 border-b border-[#F3F4F6]">
              <h2 className="text-base font-bold text-[#111827]">
                {paso === 1 ? '1. Tu negocio' : paso === 2 ? '2. Tu cuenta' : '3. Revisa y envía'}
              </h2>
              <p className="text-xs text-[#9CA3AF] mt-1">
                {paso === 1 ? 'Cuéntanos sobre tu negocio'
                : paso === 2 ? 'Crea tu cuenta de acceso'
                : 'Verifica que todo esté correcto'}
              </p>
            </div>

            {paso === 1 && <Paso1Negocio datos={datos} onChange={actualizarDatos} onSiguiente={() => setPaso(2)} />}
            {paso === 2 && <Paso2Cuenta  datos={datos} onChange={actualizarDatos} onAtras={() => setPaso(1)} onSiguiente={() => setPaso(3)} />}
            {paso === 3 && <Paso3Revisar datos={datos} onAtras={() => setPaso(2)} onEnviar={handleEnviar} enviando={enviando} error={error} />}
          </div>

          {/* Footer */}
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

export default RegistroPage