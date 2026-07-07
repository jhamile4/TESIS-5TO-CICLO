import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Navbar/Navbar.css'

function Footer() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setEnviado(true)
    setEmail('')
  }

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
            Únete a más de 2,400 negocios que ya usan CRECIO. Empieza gratis en minutos.
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

            <p className="text-xs font-semibold uppercase tracking-wider text-[#111827] mb-3">
              Suscríbete a novedades
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Tu email"
                required
                className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#E5E7EB] text-sm text-[#111827] placeholder-[#9CA3AF] outline-none focus:border-[#0D9488] transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-[#111827] text-white text-sm font-semibold transition-all hover:bg-[#0D9488] cursor-pointer whitespace-nowrap"
              >
                {enviado ? '¡Listo!' : 'Suscribir'}
              </button>
            </form>

            {/* Social */}
            <div className="flex gap-2 mt-6">
              {[
                'ri-instagram-line',
                'ri-facebook-circle-line',
                'ri-tiktok-line',
                'ri-twitter-x-line',
              ].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="w-10 h-10 flex items-center justify-center bg-[#F3F4F6] hover:bg-[#0D9488] rounded-xl transition-all cursor-pointer text-[#6B7280] hover:text-white"
                >
                  <i className={`${icon} text-base`} />
                </a>
              ))}
            </div>
          </div>

          {/* Producto */}
          <div className="md:col-span-2 md:col-start-7">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#111827] mb-5">Producto</h5>
            <ul className="flex flex-col gap-3">
              {['Cómo funciona', 'Precios', 'Herramientas IA', 'Buscador local', 'Panel de admin'].map((l) => (
                <li key={l}>
                  <a href="#" className="text-[#6B7280] hover:text-[#0D9488] text-sm transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div className="md:col-span-2">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#111827] mb-5">Empresa</h5>
            <ul className="flex flex-col gap-3">
              {['Sobre nosotros', 'Blog', 'Casos de éxito', 'Contacto', 'Trabaja con nosotros'].map((l) => (
                <li key={l}>
                  <a href="#" className="text-[#6B7280] hover:text-[#0D9488] text-sm transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Soporte */}
          <div className="md:col-span-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#111827] mb-5">Soporte</h5>
            <ul className="flex flex-col gap-3">
              <li>
                <a href="mailto:soporte@crecio.pe" className="text-[#6B7280] hover:text-[#0D9488] text-sm transition-colors flex items-center gap-2">
                  <i className="ri-mail-line text-sm" />
                  soporte@crecio.pe
                </a>
              </li>
              <li>
                <a href="https://wa.me/51987654320" target="_blank" rel="noreferrer" className="text-[#6B7280] hover:text-[#0D9488] text-sm transition-colors flex items-center gap-2">
                  <i className="ri-whatsapp-line text-sm" />
                  +51 987 654 320
                </a>
              </li>
              <li>
                <span className="text-[#6B7280] text-sm flex items-center gap-2">
                  <i className="ri-time-line text-sm" />
                  Lun–Vie: 9:00 – 18:00
                </span>
              </li>
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
            {['Privacidad', 'Términos', 'Cookies'].map((l) => (
              <a key={l} href="#" className="text-[#9CA3AF] hover:text-[#6B7280] text-xs transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer