import { useNavigate } from 'react-router-dom'
import '../Navbar/Navbar.css'
import { PANEL_URL } from '../../config/env'

function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="relative bg-[#FAFAFA] overflow-hidden">

      {/* ── Top CTA Bar oscuro ── */}
      <div className="relative bg-[#111827] py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#0D9488]/10 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-5">
            ¿Listo para
            <span className="gradient-teal"> crecer?</span>
          </h2>
          <p className="text-[#9CA3AF] text-sm md:text-base max-w-lg mx-auto mb-10">
            Crea la tienda online de tu negocio y empieza gratis en minutos.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <button
              onClick={() => navigate('/registro')}
              className="px-8 py-3.5 rounded-xl bg-[#0D9488] text-white font-semibold text-sm hover:bg-[#0F766E] transition-all shadow-lg shadow-[#0D9488]/20 hover:shadow-[#0D9488]/30 hover:scale-[1.02] whitespace-nowrap cursor-pointer"
            >
              Crear mi tienda gratis
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3.5 rounded-xl border border-[#374151] text-white font-semibold text-sm hover:border-[#0D9488] hover:text-[#0D9488] transition-all whitespace-nowrap cursor-pointer"
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>

      {/* ── Main footer ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">

          <div className="md:col-span-5">
            {/* Logo */}
            <div 
              className="logo-container-group flex items-center gap-3.5 cursor-pointer select-none mb-5" 
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
            <p className="text-[#6B7280] text-sm leading-relaxed max-w-xs mb-8">
              La plataforma que ayuda a los pequeños negocios a crecer con tecnología,
              catálogos digitales e inteligencia artificial.
            </p>

          </div>

          {/* Producto */}
          <div className="md:col-span-2 md:col-start-7">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#111827] mb-5">Producto</h5>
            <ul className="flex flex-col gap-3">
              {[
                ['Cómo funciona', '/#como-funciona'],
                ['Precios', '/#precios'],
                ['Herramientas IA', '/#ia-tools'],
                ['Explorar tiendas', '/tiendas'],
                ['Panel de mi negocio', PANEL_URL],
              ].map(([texto, href]) => (
                <li key={texto}>
                  <a href={href} className="text-[#6B7280] hover:text-[#0D9488] text-sm transition-colors">{texto}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div className="md:col-span-2">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#111827] mb-5">Cuenta</h5>
            <ul className="flex flex-col gap-3">
              {[
                ['Crear mi tienda', '/registro'],
                ['Iniciar sesión', '/login'],
                ['Recuperar contraseña', '/recuperar'],
              ].map(([texto, href]) => (
                <li key={texto}>
                  <a href={href} className="text-[#6B7280] hover:text-[#0D9488] text-sm transition-colors">{texto}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Soporte */}
          <div className="md:col-span-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#111827] mb-5">Ayuda</h5>
            <ul className="flex flex-col gap-3">
              <li className="text-[#6B7280] text-sm flex items-start gap-2">
                <i className="ri-robot-2-line text-sm mt-0.5" />
                <span>Pregúntale al Asistente CRECIO, abajo a la derecha.</span>
              </li>
              <li><a href="/privacidad" className="text-[#6B7280] hover:text-[#0D9488] text-sm transition-colors">Política de privacidad</a></li>
              <li><a href="/terminos" className="text-[#6B7280] hover:text-[#0D9488] text-sm transition-colors">Términos de servicio</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#9CA3AF] text-xs">
            &copy; 2026 CRECIO. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            {[['Privacidad', '/privacidad'], ['Términos', '/terminos']].map(([texto, href]) => (
              <a key={texto} href={href} className="text-[#9CA3AF] hover:text-[#6B7280] text-xs transition-colors">
                {texto}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer