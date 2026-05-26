import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
  const navigate = useNavigate()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="inicio" className="relative h-[100dvh] min-h-[600px] w-full overflow-hidden bg-[#0a0a0a]">

      {/* ── Video de fondo ── */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          poster="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
        >
          <source
            src="https://videos.pexels.com/video-files/18069166/18069166-hd_1920_1080_24fps.mp4"
            type="video/mp4"
          />
        </video>

        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

        {/* Textura de grano */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {/* ── Contenido ── */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">

        {/* Badge */}
        <div
          className={`mb-8 transition-all duration-1000 ${
            loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium tracking-wider text-white/80 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0D9488] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0D9488]" />
            </span>
            MÁS DE 2,400 NEGOCIOS YA CRECIENDO
          </span>
        </div>

        {/* Título principal */}
        <h1
          className={`max-w-5xl transition-all duration-1000 delay-200 ${
            loaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}
        >
          <span className="block text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl lg:text-8xl">
            Transforma tu
          </span>
          <span className="mt-2 block text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl lg:text-8xl">
            negocio en una
          </span>
          <span className="mt-2 block bg-gradient-to-r from-[#0D9488] via-[#14B8A6] to-[#2DD4BF] bg-clip-text text-5xl font-bold leading-[1.05] tracking-tight text-transparent md:text-7xl lg:text-8xl">
            empresa digital
          </span>
        </h1>

        {/* Subtítulo */}
        <p
          className={`mt-8 max-w-xl text-base leading-relaxed text-white/60 md:text-lg ${
            loaded ? 'animate-fade-in-up delay-500' : 'opacity-0'
          }`}
        >
          Inteligencia Artificial para crear catálogos, gestionar ventas y aceptar pagos.
          Todo desde tu celular. Sin saber de tecnología.
        </p>

        {/* Botones CTA */}
        <div
          className={`mt-10 flex flex-col items-center gap-4 sm:flex-row ${
            loaded ? 'animate-fade-in-up delay-700' : 'opacity-0'
          }`}
        >
          <button
            onClick={() => navigate('/registro')}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#0D9488] px-8 py-4 text-sm font-bold text-white transition-all hover:bg-[#0F766E] cursor-pointer"
          >
            <span className="relative z-10">Empieza Gratis Ahora</span>
            <i className="ri-arrow-right-line relative z-10 text-sm transition-transform group-hover:translate-x-1" />
            <div className="absolute inset-0 -translate-x-full bg-white/10 transition-transform group-hover:translate-x-0" />
          </button>

          <button
            onClick={() => scrollTo('como-funciona')}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10 cursor-pointer"
          >
            <i className="ri-play-circle-line text-base" />
            Ver cómo funciona
          </button>
        </div>

        {/* Trust pills */}
        <div
          className={`mt-14 flex flex-wrap items-center justify-center gap-6 text-xs text-white/40 ${
            loaded ? 'animate-fade-in-up delay-1000' : 'opacity-0'
          }`}
        >
          {['Sin costo inicial', 'Sin tarjeta de crédito', 'Cancela cuando quieras'].map((t) => (
            <div key={t} className="flex items-center gap-2">
              <i className="ri-checkbox-circle-fill text-[#0D9488]" />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fade a blanco abajo */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-32 bg-gradient-to-t from-white to-transparent" />

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-white/40">
          <span className="text-[10px] font-medium uppercase tracking-widest">Scroll</span>
          <div className="h-8 w-[1px] overflow-hidden bg-white/20">
            <div className="h-full w-full animate-bounce bg-white/60" style={{ transformOrigin: 'top' }} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero